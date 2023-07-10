'use client';

import { useEffect, useRef, useState } from 'react';
import { apiClient } from '@/api/apiClient';
import Endpoints from '@/api/endpoints';
import { ChatResponseDto } from '@/contract/chats/chat.response.dto.d';
import {
  createChatMessageFactory,
  createChatMessagesWithResponseFactory,
  createChatParticipantsFactory,
  createSocketMessageRequestFactory,
} from '@/factory/create-chat.factory';
import { useAuth } from '@clerk/nextjs';
import { getCookie } from 'cookies-next';
import { useRecoilValue } from 'recoil';

import { ChatMessageType, ChatUserType } from '@/types/chat';
import { useRefState } from '@/hooks/use-ref-state';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Message } from '@/components/message';
import { MessageForm } from '@/components/message-form';
import { socketState } from '@/app/state/socket';

interface ChatProps {
  roomId: string;
}

const parseMessageList = (
  chat: ChatResponseDto,
  participants: ChatUserType[]
) => {
  const messageArr: ChatMessageType[] = [];
  chat.messageHistory.forEach((message) => {
    if (!message.sender.isAi) {
      const aiMessage = chat.messageHistory.find(
        (aiResponse) => message.id === aiResponse.meta.replyTo
      );
      const user = participants.find(
        (user) => message.sender.userId === user.userId
      );
      messageArr.push(createChatMessageFactory(message, aiMessage, user));
    }
  });

  return messageArr;
};

export default function Chat({ roomId }: ChatProps) {
  const socket = useRecoilValue(socketState);
  const { sessionId, userId } = useAuth();
  const token = getCookie('__session');
  const [chat, setChat] = useState<ChatResponseDto>();
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const bottomEl = useRef<HTMLDivElement>(null);
  const [participants, setParticipants] = useRefState<ChatUserType[]>([]);

  const scrollToBottom = () => {
    if (bottomEl) {
      bottomEl.current?.scroll({
        top: bottomEl.current?.scrollHeight,
        behavior: 'smooth',
      });
    }
  };
  async function getChat(roomId: string) {
    try {
      const res = await apiClient({
        url: Endpoints.chats.getChat(roomId),
        options: { method: 'GET' },
        sessionId: sessionId ?? '',
        jwtToken: token?.toString() ?? '',
      });
      if (!res.ok) {
        const { error } = JSON.parse(await res.text());
        return error;
      }
      return res.json();
    } catch (e) {
      console.log(e);
    }
  }

  async function getChatParticipants(participants: string[]) {
    try {
      const res = await apiClient({
        url: Endpoints.users.getUsers(participants),
        options: { method: 'GET' },
        sessionId: sessionId ?? '',
        jwtToken: token?.toString() ?? '',
      });
      if (!res.ok) {
        const { error } = JSON.parse(await res.text());
        return error;
      }
      return res.json();
    } catch (e) {
      console.log(e);
    }
  }

  async function getUser(userId: string) {
    try {
      const res = await apiClient({
        url: Endpoints.users.getUser(userId),
        options: { method: 'GET' },
        sessionId: sessionId ?? '',
        jwtToken: token?.toString() ?? '',
      });
      return res.json();
    } catch (e) {
      console.log(e);
    }
  }

  const addUserToMessage = async (userId: string): Promise<ChatUserType> => {
    const userInParticipants = participants.current.find(
      (participant) => participant.userId === userId
    );

    if (userInParticipants) {
      return userInParticipants;
    }

    const user = await getUser(userId);

    setParticipants([
      ...participants.current,
      {
        userId,
        imageUrl: user.profileImageUrl,
        userName: user.username,
        name: user.name,
        email: user.email,
      },
    ]);

    return {
      userId,
      imageUrl: user.profileImageUrl,
      userName: user.username,
      name: user.name,
      email: user.email,
    };
  };

  useEffect(() => {
    socket.emit(
      'joinRoom',
      { data: { roomId, userId } },
      async (response: string) => {
        if (response) {
          setChat(await getChat(response));
        }
      }
    );
    socket.on('message', async (message) => {
      if (message.isAi) {
        setMessages((messages) =>
          createChatMessagesWithResponseFactory(messages, message)
        );
      } else {
        const user = await addUserToMessage(message.userId);
        setMessages((messages) => {
          return [
            ...messages,
            {
              id: message.id,
              content: message.response,
              createdAt: message.createdAt,
              user,
            },
          ];
        });
      }
    });
    return () => {
      socket.emit('leaveRoom', { data: { roomId } });
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    async function setInitialData() {
      if (chat && chat.participantIds.length > 0) {
        const participantList = createChatParticipantsFactory(
          await getChatParticipants(chat.participantIds)
        );
        setParticipants(participantList);
        setMessages(parseMessageList(chat, participantList));
      }
    }
    void setInitialData();
    scrollToBottom();
  }, [chat, parseMessageList]);

  const sendMessage = (value: string) => {
    socket.emit('message', {
      data: createSocketMessageRequestFactory(roomId, value, userId ?? ''),
    });
  };
  return (
    <div className="flex h-full w-full flex-col">
      <ScrollArea ref={bottomEl} className="h-full">
        <div className="w-full px-4 pt-4">
          {messages.map((message, index) => {
            return <Message key={String(index)} message={message}></Message>;
          })}
        </div>
      </ScrollArea>
      <div className="mx-4 mt-2 rounded-t-xl border bg-background px-4 py-2 shadow-lg">
        <MessageForm
          onSubmit={async (value) => sendMessage(value)}
          scrollToBottom={scrollToBottom}
        />
      </div>
    </div>
  );
}
