import '@/styles/globals.css';
import { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { apiClient } from '@/api/apiClient';
import Endpoints from '@/api/endpoints';
import { AiModelResponseDto } from '@/contract/ai/ai-model.response.dto.d';
import { ChatResponseDto } from '@/contract/chats/chat.response.dto.d';
import { RoomResponseDto } from '@/contract/rooms/room.response.dto.d';
import { auth } from '@clerk/nextjs';

import { RoomHeader } from '@/components/room-header';

interface RootLayoutProps {
  children: React.ReactNode;
}

const getRoom = async (
  roomId: string
): Promise<RoomResponseDto | undefined> => {
  const { sessionId, getToken } = auth();

  try {
    const res = await apiClient({
      url: Endpoints.rooms.getRoomById(roomId),
      options: { method: 'GET', cache: 'no-store' },
      sessionId: sessionId ?? '',
      jwtToken: (await getToken()) ?? '',
    });
    if (!res.ok) {
      return;
    }

    return res.json();
  } catch (e) {
    console.log(e);
  }
};

const getChat = async (
  roomId: string
): Promise<ChatResponseDto | undefined> => {
  const { sessionId, getToken } = auth();

  try {
    const res = await apiClient({
      url: Endpoints.chats.getChat(roomId),
      options: { method: 'GET' },
      sessionId: sessionId ?? '',
      jwtToken: (await getToken()) ?? '',
    });
    if (!res.ok) {
      return;
    }

    return res.json();
  } catch (e) {
    console.log(e);
  }
};

const getAiModel = async (
  aiModelId: string
): Promise<AiModelResponseDto | undefined> => {
  const { sessionId, getToken } = auth();

  try {
    const res = await apiClient({
      url: Endpoints.ai.getAiModel(aiModelId),
      options: { method: 'GET' },
      sessionId: sessionId ?? '',
      jwtToken: (await getToken()) ?? '',
    });
    if (!res.ok) {
      return;
    }

    return res.json();
  } catch (e) {
    console.log(e);
  }
};

export default async function RoomLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { room: string };
}) {
  const [room, chat] = await Promise.all([
    getRoom(params.room),
    getChat(params.room),
  ]);

  const aiModel = await getAiModel(chat?.aiModelId ?? '');

  if (!room) {
    redirect('/');
  }

  return (
    <div className="flex h-full w-full flex-col">
      <RoomHeader id={room.id} name={room.name} llmModel={aiModel} />
      <div className="h-[calc(100%-41px)] w-full">{children}</div>
    </div>
  );
}
