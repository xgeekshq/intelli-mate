import {
  GET_PUBLIC_ROOMS_REQ_KEY,
  getPublicRooms,
} from '@/api/requests/rooms/get-public-rooms';
import { RoomResponseDto } from '@/contract/rooms/room.response.dto.d';
import { auth } from '@clerk/nextjs';
import { Hydrate, dehydrate } from '@tanstack/react-query';

import { PublicRoomsListType } from '@/types/searchList';
import RoomSearchItems from '@/components/room-search-items';
import { SearchList } from '@/components/search-list';
import getQueryClient from '@/app/get-query-client';

const getSearchRoomsList = (
  rooms: RoomResponseDto[],
  userId: string | null
): PublicRoomsListType[] => {
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
  const { getToken, userId } = auth();
  const token = await getToken();
  const queryClient = getQueryClient();
  const publicRooms = await queryClient.fetchQuery(
    [GET_PUBLIC_ROOMS_REQ_KEY],
    () => getPublicRooms(token)
  );
  const dehydratedState = dehydrate(queryClient);
  const publicRoomsSearchList = getSearchRoomsList(publicRooms, userId);

  return (
    <Hydrate state={dehydratedState}>
      <div className="flex h-full w-full flex-col items-center gap-20 py-24">
        <p className="w-2/3 text-center text-xl">
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
    </Hydrate>
  );
}
