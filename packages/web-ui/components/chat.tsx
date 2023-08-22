'use client';

import { useEffect, useRef, useState } from 'react';
import { ClerkFetcherParamsType, apiClient } from '@/api/apiClient';
import Endpoints from '@/api/endpoints';
import { UserResponseDto } from '@/contract/auth/user.response.dto.d';
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
import { useToast } from '@/components/ui/use-toast';
import { Message } from '@/components/message';
import { MessageForm } from '@/components/message-form';
import { socketState } from '@/app/state/socket';

interface ChatProps {
  chat: ChatResponseDto;
  roomId: string;
  isOwner: boolean;
  ownerRoles: string[];
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

async function baseGetRequest<T>(
  options: ClerkFetcherParamsType
): Promise<T | undefined> {
  try {
    const res = await apiClient(options);
    if (!res.ok) {
      const { error } = JSON.parse(await res.text());
      return error;
    }

    return res.json();
  } catch (e) {
    console.log(e);
  }
}

export default function Chat({ chat, roomId, isOwner, ownerRoles }: ChatProps) {
  const socket = useRecoilValue(socketState);
  const { toast } = useToast();

  const { sessionId, userId } = useAuth();
  const token = getCookie('__session');

  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [participants, setParticipants] = useRefState<ChatUserType[]>([]);
  const bottomEl = useRef<HTMLDivElement>(null);

  const requestOptions = {
    options: { method: 'GET' },
    sessionId: sessionId ?? '',
    jwtToken: token?.toString() ?? '',
  };

  const scrollToBottom = () => {
    if (bottomEl) {
      bottomEl.current?.scroll({
        top: bottomEl.current?.scrollHeight,
        behavior: 'smooth',
      });
    }
  };
  const getChatParticipants = async (participants: string[]) =>
    baseGetRequest<UserResponseDto[]>({
      url: Endpoints.users.getUsers(participants),
      ...requestOptions,
    });

  const getUser = async (userId: string) =>
    baseGetRequest<UserResponseDto>({
      url: Endpoints.users.getUser(userId),
      ...requestOptions,
    });

  const addUserToMessage = async (
    userId: string
  ): Promise<ChatUserType | undefined> => {
    const userInParticipants = participants.current.find(
      (participant) => participant.userId === userId
    );

    if (userInParticipants) {
      return userInParticipants;
    }

    const user = await getUser(userId);

    if (!user) {
      return;
    }

    const [parsedUser] = createChatParticipantsFactory([user]);

    setParticipants([...participants.current, parsedUser]);
    return parsedUser;
  };

  useEffect(() => {
    socket.emit('joinRoom', { data: { roomId, userId } });

    socket.on('message', async (message) => {
      if (message.isAi) {
        setMessages((messages) =>
          createChatMessagesWithResponseFactory(messages, message)
        );
      } else {
        const messageIds = messages.map(({ id }) => id);

        if (messageIds.includes(message.id)) {
          return;
        }

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

    socket.on('documentReady', async (message) => {
      toast({
        title: 'Document ready',
        description: `The document ${message.filename} is ready to be consulted.`,
      });
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
          {messages.map((message) => {
            return <Message key={message.id} message={message} />;
          })}
        </div>
      </ScrollArea>
      <div className="mx-4 mt-2 rounded-t-xl border bg-background px-4 py-2 shadow-lg">
        <MessageForm
          onSubmit={async (value) => sendMessage(value)}
          scrollToBottom={scrollToBottom}
          isOwner={isOwner}
          ownerRoles={ownerRoles}
        />
      </div>
    </div>
  );
}
