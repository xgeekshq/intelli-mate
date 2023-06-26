'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/api/apiClient';
import Endpoints from '@/api/endpoints';
import { ChatResponseDto } from '@/contract/chats/chat.response.dto.d';
import { useAuth } from '@clerk/nextjs';
import { getCookie } from 'cookies-next';
import { useRecoilValue } from 'recoil';

import { ScrollArea } from '@/components/ui/scroll-area';
import { socketState } from '@/app/state/socket';

export default function Room({ params }: { params: { room: string } }) {
  const socket = useRecoilValue(socketState);
  const { sessionId } = useAuth();
  const token = getCookie('__session');
  const [chat, setChat] = useState<ChatResponseDto>();
  const roomId = params.room;
  async function getChat(roomId: string) {
    try {
      const res = await apiClient({
        url: Endpoints.chats.getChat(roomId),
        options: { method: 'GET' },
        sessionId: sessionId ? sessionId : '',
        jwtToken: token ? token.toString() : '',
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

  useEffect(() => {
    socket.emit('joinRoom', { data: { roomId } }, async (response: string) => {
      if (response) {
        setChat(await getChat(response));
      }
    });

    return () => {
      socket.emit('leaveRoom', { roomId });
    };
  }, []);

  if (!chat) {
    return <p>Loading</p>;
  }
  return (
    <div className="flex h-full flex-col">
      <ScrollArea className="flex-1">
        <div className="space-y-1 p-2">Chat</div>
      </ScrollArea>
    </div>
  );
}
