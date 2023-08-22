import { cookies } from 'next/headers';
import { apiClient } from '@/api/apiClient';
import Endpoints from '@/api/endpoints';
import { RoomResponseDto } from '@/contract/rooms/room.response.dto.d';
import { auth } from '@clerk/nextjs';

import { PublicRoomsListType } from '@/types/searchList';
import RoomSearchItems from '@/components/room-search-items';
import { SearchList } from '@/components/search-list';

const getPublicRooms = async () => {
  try {
    const { sessionId } = auth();
    const nextCookies = cookies();
    const clerkJwtToken = nextCookies.get('__session');
    const res = await apiClient({
      url: Endpoints.rooms.getPublicRooms(),
      options: { method: 'GET' },
      sessionId: sessionId ?? '',
      jwtToken: clerkJwtToken?.value ?? '',
    });
    return res.json();
  } catch (e) {
    console.log(e);
  }
};

const getSearchRoomsList = (
  rooms: RoomResponseDto[]
): PublicRoomsListType[] => {
  const { userId } = auth();
  return rooms.map((room) => {
    return {
      label: room.name,
      value: room.name,
      isMember: room.members.includes(userId!),
      roomId: room.id,
    };
  });
};

export default async function Rooms() {
  const publicRoomsSearchList = getSearchRoomsList(await getPublicRooms());
  return (
    <div className="flex h-full w-full flex-col items-center gap-20 py-24">
      <p className="w-2/3 text-xl">
        Start chatting with your co-workers and our helpful AI by joining a
        public room or by creating your own room.
      </p>
      <SearchList
        notFoundText="Room not found."
        searchPlaceholder="Type a room name"
        searchText="Search for a room"
      >
        <RoomSearchItems data={publicRoomsSearchList} />
      </SearchList>
    </div>
  );
}
