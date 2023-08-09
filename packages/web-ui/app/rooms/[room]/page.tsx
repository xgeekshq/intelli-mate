import { cookies } from 'next/headers';
import { apiClient } from '@/api/apiClient';
import Endpoints from '@/api/endpoints';
import { UserResponseDto } from '@/contract/auth/user.response.dto.d';
import { RoomResponseDto } from '@/contract/rooms/room.response.dto.d';
import { auth } from '@clerk/nextjs';

import Chat from '@/components/chat';

const getRoom = async (
  sessionId: string,
  clerkJwtToken: string,
  roomId: string
) => {
  try {
    const res = await apiClient({
      url: Endpoints.rooms.getRoomById(roomId),
      options: { method: 'GET' },
      sessionId: sessionId,
      jwtToken: clerkJwtToken,
    });
    return res.json();
  } catch (e) {
    console.log(e);
  }
};
const getOwner = async (
  sessionId: string,
  clerkJwtToken: string,
  ownerId: string
) => {
  try {
    const res = await apiClient({
      url: Endpoints.users.getUser(ownerId),
      options: { method: 'GET' },
      sessionId: sessionId,
      jwtToken: clerkJwtToken,
    });
    return res.json();
  } catch (e) {
    console.log(e);
  }
};
export default async function Room({ params }: { params: { room: string } }) {
  const { sessionId, userId } = auth();
  const nextCookies = cookies();
  const clerkJwtToken = nextCookies.get('__session');

  const room: RoomResponseDto = await getRoom(
    sessionId!,
    clerkJwtToken!.value,
    params.room
  );

  const owner: UserResponseDto = await getOwner(
    sessionId!,
    clerkJwtToken!.value,
    room.ownerId
  );

  const isOwner = owner.id === userId;

  return (
    <div className="flex h-full w-full flex-col">
      <Chat roomId={params.room} isOwner={isOwner} ownerRoles={owner.roles} />
    </div>
  );
}
