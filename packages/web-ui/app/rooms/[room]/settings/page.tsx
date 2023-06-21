import { cookies } from 'next/headers';
import { client } from '@/api/client';
import Endpoints from '@/api/endpoints';
import { UserResponseDto } from '@/contract/auth/user.response.dto.d';
import { RoomResponseDto } from '@/contract/rooms/room.response.dto.d';
import { auth } from '@clerk/nextjs';

import { UserListType } from '@/types/searchList';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CommandItem } from '@/components/ui/command';
import { ScrollArea } from '@/components/ui/scroll-area';
import LeaveRoom from '@/components/leave-room';
import { SearchList } from '@/components/search-list';
import { UpdateRoomForm } from '@/components/update-room-form';
import UserSearchItems from '@/components/user-search-items';

const MemberUserSearchItems = ({ data }: { data: UserListType[] }) => {
  return (
    <>
      {data.map((item) => (
        <CommandItem
          className="flex justify-between hover:cursor-pointer"
          value={item.value}
          key={item.value}
        >
          <Avatar className="h-4 w-4">
            <AvatarImage src={item.imageUrl} alt={item.value} />
          </Avatar>
          {item.label || item.value}
        </CommandItem>
      ))}
    </>
  );
};

const getRoom = async (
  sessionId: string,
  clerkJwtToken: string,
  roomName: string
) => {
  try {
    const res = await client({
      url: Endpoints.rooms.getRoomByName(roomName),
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
    const res = await client({
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

const getAllUsers = async (sessionId: string, clerkJwtToken: string) => {
  try {
    const res = await client({
      url: Endpoints.users.getUsers(),
      options: { method: 'GET' },
      sessionId: sessionId,
      jwtToken: clerkJwtToken,
    });
    return res.json();
  } catch (e) {
    console.log(e);
  }
};

const getRoomMembers = async (
  sessionId: string,
  clerkJwtToken: string,
  members: string[]
) => {
  try {
    const res = await client({
      url: Endpoints.users.getUsers(members),
      options: { method: 'GET' },
      sessionId: sessionId,
      jwtToken: clerkJwtToken,
    });
    return res.json();
  } catch (e) {
    console.log(e);
  }
};

const getUserList = (users: UserResponseDto[]): UserListType[] => {
  return users.map((user) => {
    return {
      label:
        user.firstName && user.lastName
          ? `${user.firstName} ${user.firstName}`
          : '',
      value: user.username,
      imageUrl: user.profileImageUrl,
      userId: user.id,
    };
  });
};

export default async function Settings({
  params,
}: {
  params: { room: string };
}) {
  const { sessionId, userId } = auth();
  const nextCookies = cookies();
  const clerkJwtToken = nextCookies.get('__session');

  const room: RoomResponseDto = await getRoom(
    sessionId!,
    clerkJwtToken!.value,
    params.room
  );

  const members: UserResponseDto[] = await getRoomMembers(
    sessionId!,
    clerkJwtToken!.value,
    room.members
  );

  const allUsers: UserResponseDto[] = await getAllUsers(
    sessionId!,
    clerkJwtToken!.value
  );

  const userSearchList = getUserList(
    allUsers.filter((user) => !members.some((member) => user.id === member.id))
  );
  const membersSearchList = getUserList(members);

  const owner: UserResponseDto = await getOwner(
    sessionId!,
    clerkJwtToken!.value,
    room.ownerId
  );

  const isOwner = owner.id === userId;

  return (
    <div className="h-full p-6">
      <Card className="h-full w-full">
        <CardHeader>
          <CardTitle>Room Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 p-4">
            {isOwner && (
              <UpdateRoomForm
                id={room.id}
                name={room.name}
                isPrivate={room.isPrivate}
              />
            )}
            <div className="flex flex-col gap-2 rounded-lg border p-4">
              <p className="text-sm font-bold">Room Owner</p>
              <div className="flex gap-2">
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    src={owner.profileImageUrl}
                    alt={owner.username}
                  />
                </Avatar>
                <div className="flex flex-col">
                  <p>{owner.username}</p>
                  <p className="text-sm text-gray-500">
                    {owner.firstName && owner.lastName
                      ? `${owner.firstName} ${owner.lastName}`
                      : ''}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2 rounded-lg border p-4">
              <p className="text-sm font-bold">Invite User</p>
              <SearchList
                notFoundText="User not found."
                searchPlaceholder="Type a user username"
                searchText="Search for a user"
                width="w-full"
              >
                <UserSearchItems data={userSearchList} roomId={room.id} />
              </SearchList>
            </div>
            <div className="flex flex-col gap-2 rounded-lg border p-4">
              <p className="text-sm font-bold">Member List</p>
              <ScrollArea className="flex h-96">
                {membersSearchList.map((item) => (
                  <div className="flex items-center gap-4 py-1">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={item.imageUrl} alt={item.value} />
                    </Avatar>
                    <div className="flex flex-col">
                      <p className="text-sm">{item.value}</p>
                      <p className="text-xs text-gray-500">
                        {item.label && `(${item.label})`}
                      </p>
                    </div>
                  </div>
                ))}
              </ScrollArea>
            </div>
          </div>
        </CardContent>
        {!isOwner && (
          <CardFooter className="flex justify-center">
            <LeaveRoom roomId={room.id} />
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
