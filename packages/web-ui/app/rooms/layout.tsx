import '@/styles/globals.css';
import { cookies } from 'next/headers';
import { apiClient } from '@/api/apiClient';
import Endpoints from '@/api/endpoints';
import { RoomResponseDto } from '@/contract/rooms/room.response.dto.d';
import { auth } from '@clerk/nextjs';

import { Rooms } from '@/components/rooms';

interface RootLayoutProps {
  children: React.ReactNode;
}
const getMyRooms = async () => {
  try {
    const nextCookies = cookies();
    const clerkJwtToken = nextCookies.get('__session');
    const { sessionId } = auth();
    const res = await apiClient({
      url: Endpoints.rooms.getMyRooms(),
      options: { method: 'GET' },
      sessionId: sessionId ? sessionId : '',
      jwtToken: clerkJwtToken ? clerkJwtToken.value : '',
    });
    return res.json();
  } catch (e) {
    console.log(e);
  }
};

export default async function RoomsLayout({ children }: RootLayoutProps) {
  const rooms: RoomResponseDto[] = await getMyRooms();
  return (
    <div className="flex h-full">
      <Rooms rooms={rooms} />
      <div className="h-full w-full">{children}</div>
    </div>
  );
}
