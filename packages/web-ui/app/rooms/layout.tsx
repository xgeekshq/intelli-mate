import '@/styles/globals.css';
import { cookies } from 'next/headers';
import { apiClient } from '@/api/apiClient';
import Endpoints from '@/api/endpoints';
import { auth } from '@clerk/nextjs';

import { Rooms } from '@/components/rooms';
import { StateProvider } from '@/components/state-provider';

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
      sessionId: sessionId ?? '',
      jwtToken: clerkJwtToken?.value ?? '',
    });
    return res.json();
  } catch (e) {
    console.log(e);
  }
};

export default async function RoomsLayout({ children }: RootLayoutProps) {
  const rooms = await getMyRooms();
  return (
    <div className="flex h-full">
      <StateProvider>
        <Rooms rooms={rooms} />
        <div className="h-full w-full">{children}</div>
      </StateProvider>
    </div>
  );
}
