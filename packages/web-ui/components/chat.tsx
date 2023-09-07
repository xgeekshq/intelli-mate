'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { ClerkFetcherParamsType, apiClient } from '@/api/apiClient';
import Endpoints from '@/api/endpoints';
import { UserResponseDto } from '@/contract/auth/user.response.dto.d';
import { ChatResponseDto } from '@/contract/chats/chat.response.dto.d';
import {
  createChatMessageFactory,
  createChatParticipantsFactory,
} from '@/factory/create-chat.factory';
import { useAuth } from '@clerk/nextjs';
import { ChevronDownCircle } from 'lucide-react';

import { ChatMessageType, ChatUserType } from '@/types/chat';
import { useAutoScroll } from '@/hooks/use-auto-scroll';
import { useRefState } from '@/hooks/use-ref-state';
import { useSocketCommunication } from '@/hooks/use-socket-communication';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import Message from '@/components/message';
import { MessageForm } from '@/components/message-form';

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

const requestOptions = (sessionId?: string | null) => ({
  options: { method: 'GET' },
  sessionId: sessionId ?? '',
});

export default function Chat({ chat, roomId, isOwner, ownerRoles }: ChatProps) {
  const { sessionId, userId, getToken } = useAuth();
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [participants, setParticipants] = useRefState<ChatUserType[]>([]);
  const [showScrollToBottomButton, setShowScrollToBottomButton] =
    useState(false);
  const bottomEl = useRef<HTMLDivElement>(null);
  const chatHasDocuments = useMemo(
    () => chat.documents.length > 0,
    [chat.documents]
  );

  const scrollToBottom = () => {
    if (bottomEl) {
      bottomEl.current?.scroll({
        top: bottomEl.current?.scrollHeight,
        behavior: 'smooth',
      });
    }
  };

  const addUserToMessage = async (
    userId: string
  ): Promise<ChatUserType | undefined> => {
    const getUser = async (userId: string) =>
      baseGetRequest<UserResponseDto>({
        url: Endpoints.users.getUser(userId),
        jwtToken: (await getToken()) ?? '',
        ...requestOptions(sessionId),
      });

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

  const { sendMessage } = useSocketCommunication({
    roomId,
    userId,
    messages,
    setMessages,
    addUserToMessage,
  });

  useAutoScroll(bottomEl, setShowScrollToBottomButton);

  useEffect(() => {
    if (!showScrollToBottomButton) {
      scrollToBottom();
    }
  }, [messages]);

  useEffect(() => {
    const getChatParticipants = async (participants: string[]) =>
      baseGetRequest<UserResponseDto[]>({
        url: Endpoints.users.getUsers(participants),
        jwtToken: (await getToken()) ?? '',
        ...requestOptions(sessionId),
      });

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

  return (
    <div className="flex h-full w-full flex-col">
      <ScrollArea ref={bottomEl} className="h-full">
        <div className="relative w-full px-4 pt-4">
          {messages.map((message) => {
            return <Message key={message.id} message={message} />;
          })}
          {showScrollToBottomButton && (
            <Button
              onClick={scrollToBottom}
              variant="ghost"
              className={`fixed bottom-20 h-7 w-7 rounded-full p-0 ${
                chatHasDocuments
                  ? 'right-[calc(var(--chat-tools)+24px)]'
                  : 'right-6'
              }`}
            >
              <ChevronDownCircle width={28} height={28} />
            </Button>
          )}
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
