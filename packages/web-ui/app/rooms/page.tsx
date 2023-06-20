import { cookies } from 'next/headers';
import { client } from '@/api/client';
import Endpoints from '@/api/endpoints';
import { RoomResponseDto } from '@/contract/rooms/room.response.dto.d';
import { auth } from '@clerk/nextjs';

import { PublicRoomsLisType } from '@/types/searchList';
import { SearchList } from '@/components/search-list';

const getPublicRooms = async () => {
  try {
    const { sessionId } = auth();
    const nextCookies = cookies();
    const clerkJwtToken = nextCookies.get('__session');
    const res = await client({
      url: Endpoints.rooms.getPublicRooms(),
      options: { method: 'GET' },
      sessionId: sessionId ? sessionId : '',
      jwtToken: clerkJwtToken ? clerkJwtToken.value : '',
    });
    return res.json();
  } catch (e) {
    console.log(e);
  }
};

const searchRoomsList = (rooms: RoomResponseDto[]): PublicRoomsLisType[] => {
  const { userId } = auth();
  return rooms.map((room: RoomResponseDto): PublicRoomsLisType => {
    return {
      label: room.name,
      value: room.name,
      isMember: room.members.includes(userId!),
    };
  });
};
export default async function Rooms() {
  const publicRoomsSearchList = searchRoomsList(await getPublicRooms());
  return (
    <div className="flex h-full w-full flex-col items-center gap-20 py-24">
      <p className="w-2/3 text-center text-2xl">
        Introducing Intelli-Mate: the ultimate collaborative rooms chat system
        that revolutionizes team communication. With real-time messaging, and
        seamless integration, teams can effortlessly collaborate, share ideas,
        and boost productivity. Say goodbye to scattered conversations and hello
        to streamlined teamwork.
      </p>
      <SearchList<PublicRoomsLisType>
        data={publicRoomsSearchList}
        notFoundText="Room not found."
        searchPlaceholder="Type a room name"
        searchText="Search for a room"
        additionalText="Already joined"
      />
    </div>
  );
}
