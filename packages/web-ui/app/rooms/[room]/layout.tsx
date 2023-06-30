import '@/styles/globals.css';
import { ReactNode } from 'react';
import { cookies } from 'next/headers';
import { apiClient } from '@/api/apiClient';
import Endpoints from '@/api/endpoints';
import { auth } from '@clerk/nextjs';

import { RoomHeader } from '@/components/room-header';

interface RootLayoutProps {
  children: React.ReactNode;
}
const getRoom = async (roomId: string) => {
  try {
    const nextCookies = cookies();
    const clerkJwtToken = nextCookies.get('__session');
    const { sessionId } = auth();
    const res = await apiClient({
      url: Endpoints.rooms.getRoomById(roomId),
      options: { method: 'GET', cache: 'no-store' },
      sessionId: sessionId ?? '',
      jwtToken: clerkJwtToken?.value ?? '',
    });
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
  const room = await getRoom(params.room);
  return (
    <div className="flex h-full w-full flex-col">
      <RoomHeader id={room.id} name={room.name} />
      <div className="h-[calc(100%-41px)] w-full">{children}</div>
    </div>
  );
}
