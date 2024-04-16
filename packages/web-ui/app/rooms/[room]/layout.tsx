import '@/styles/globals.css';
import { redirect } from 'next/navigation';
import {
  GET_AI_MODEL_REQ_KEY,
  getAiModel,
} from '@/api/requests/ai-models/get-ai-model';
import { GET_CHAT_REQ_KEY, getChat } from '@/api/requests/rooms/get-chat';
import { GET_ROOM_REQ_KEY, getRoom } from '@/api/requests/rooms/get-room';
import { auth } from '@clerk/nextjs';
import { Hydrate, dehydrate } from '@tanstack/react-query';

import { RoomHeader } from '@/components/room-header';
import getQueryClient from '@/app/get-query-client';

interface RootLayoutProps {
  children: React.ReactNode;
  params: { room: string };
}

export default async function RoomLayout({
  children,
  params,
}: RootLayoutProps) {
  const { getToken } = auth();
  const token = await getToken();

  const queryClient = getQueryClient();
  const room = await queryClient.fetchQuery([GET_ROOM_REQ_KEY], () =>
    getRoom(params.room, token)
  );
  const chat = await queryClient.fetchQuery([GET_CHAT_REQ_KEY], () =>
    getChat(params.room, token)
  );
  const aiModel = await queryClient.fetchQuery([GET_AI_MODEL_REQ_KEY], () =>
    getAiModel(chat.aiModelId ?? '', token)
  );
  const dehydratedState = dehydrate(queryClient);

  if (!room) {
    redirect('/');
  }

  return (
    <Hydrate state={dehydratedState}>
      <div className="flex size-full flex-col">
        <RoomHeader id={room.id} name={room.name} llmModel={aiModel} />
        <div className="h-[calc(100%-41px)] w-full">{children}</div>
      </div>
    </Hydrate>
  );
}
