import { Dispatch, SetStateAction, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  createChatMessagesWithResponseFactory,
  createSocketMessageRequestFactory,
} from '@/factory/create-chat.factory';
import { useRecoilValue } from 'recoil';

import { ChatMessageType, ChatUserType } from '@/types/chat';
import { useToast } from '@/components/ui/use-toast';
import { socketState } from '@/app/state/socket';

interface UseSocketCommunicationProps {
  roomId: string;
  aiModelId: string;
  userId?: string | null;
  messages: ChatMessageType[];
  setMessages: Dispatch<SetStateAction<ChatMessageType[]>>;
  addUserToMessage: (userId: string) => Promise<ChatUserType | undefined>;
}

export function useSocketCommunication({
  roomId,
  aiModelId,
  userId,
  messages,
  setMessages,
  addUserToMessage,
}: UseSocketCommunicationProps) {
  const router = useRouter();
  const socket = useRecoilValue(socketState);
  const { toast } = useToast();

  const sendMessage = (value: string) => {
    socket.emit('message', {
      data: createSocketMessageRequestFactory({
        roomId,
        aiModelId,
        content: value,
        userId: userId ?? '',
      }),
    });
  };

  const onWindowFocus = () => {
    socket.emit('rejoinRoom', { data: { roomId } });
  };

  useEffect(() => {
    socket.emit('joinRoom', { data: { roomId, userId } });

    socket.on('message', async (message) => {
      console.log('onMessage: ', message);
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
      router.refresh();
    });
    window.addEventListener('focus', onWindowFocus);

    return () => {
      socket.emit('leaveRoom', { data: { roomId } });
      window.removeEventListener('focus', onWindowFocus);
    };
  }, []);

  return { sendMessage };
}
