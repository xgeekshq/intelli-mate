import { cookies } from 'next/headers';
import { apiClient } from '@/api/apiClient';
import Endpoints from '@/api/endpoints';
import { UserResponseDto } from '@/contract/auth/user.response.dto.d';
import { RoomResponseDto } from '@/contract/rooms/room.response.dto.d';
import { getUserIdentification } from '@/utils/get-user-identification';
import { auth } from '@clerk/nextjs';

import { UserListType } from '@/types/searchList';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
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
          value={item.value ?? ''}
          key={item.value}
        >
          <Avatar className="h-4 w-4">
            <AvatarImage
              src={item.imageUrl}
              alt={item.value ?? 'profileImage'}
            />
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

const getAllUsers = async (sessionId: string, clerkJwtToken: string) => {
  try {
    const res = await apiClient({
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
    const res = await apiClient({
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
    const userIdentification = getUserIdentification({
      userId: user.id,
      name:
        user.firstName && user.lastName
          ? `${user.firstName} ${user.lastName}`
          : null,
      userName: user.username,
      imageUrl: user.profileImageUrl,
      email:
        user.emailAddresses.find(
          (email) => user.primaryEmailAddressId === email.id
        )?.emailAddress ?? '',
    });
    return {
      label: userIdentification,
      value: userIdentification,
      imageUrl: user.profileImageUrl,
      userId: user.id,
      roles: user.roles,
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

  const [members, allUsers, owner] = await Promise.all<
    [
      Promise<UserResponseDto[]>,
      Promise<UserResponseDto[]>,
      Promise<UserResponseDto>
    ]
  >([
    getRoomMembers(sessionId!, clerkJwtToken!.value, room.members),
    getAllUsers(sessionId!, clerkJwtToken!.value),
    getOwner(sessionId!, clerkJwtToken!.value, room.ownerId),
  ]);

  const userSearchList = getUserList(
    allUsers.filter((user) => !members.some((member) => user.id === member.id))
  );

  const membersSearchList = getUserList(members);

  const isOwner = owner.id === userId;

  return (
    <div className="h-full">
      <div className="flex flex-col gap-4 p-4">
        {!isOwner && (
          <div className="flex flex-col gap-2 rounded-lg border p-4">
            <p className="font-bold">Room Actions</p>
            <div className="w-60">
              <LeaveRoom roomId={room.id} />
            </div>
          </div>
        )}
        {isOwner && (
          <UpdateRoomForm
            id={room.id}
            name={room.name}
            isPrivate={room.isPrivate}
          />
        )}
        <div className="flex flex-col gap-2 rounded-lg border p-4">
          <p className="font-bold">Room owner</p>
          <div className="flex gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={owner.profileImageUrl} alt="Profile Image" />
            </Avatar>
            <div className="flex flex-col text-gray-500">
              <p>{`Name: ${
                owner.firstName && owner.lastName
                  ? `${owner.firstName} ${owner.lastName}`
                  : ' - '
              }`}</p>
              <p>
                {`Email: ${
                  owner.emailAddresses.find(
                    (email) => owner.primaryEmailAddressId === email.id
                  )?.emailAddress ?? ' - '
                }`}
              </p>
              <p>{`Username: ${owner.username}`}</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 rounded-lg border p-4">
          <p className="font-bold">Invite a user</p>
          <SearchList
            notFoundText="User not found."
            searchPlaceholder="Type a user username"
            searchText="Search for a user"
            width="w-full"
          >
            <UserSearchItems
              data={userSearchList}
              roomId={room.id}
              roomOwnerRoles={owner.roles}
            />
          </SearchList>
        </div>
        <div className="flex flex-col gap-2 rounded-lg border p-4">
          <p className="font-bold">Member list</p>
          <ScrollArea className="flex h-96">
            {membersSearchList.map((item) => (
              <div className="flex items-center gap-4 py-1">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={item.imageUrl}
                    alt={item.value ?? 'profileImage'}
                  />
                </Avatar>
                <div className="flex flex-col">
                  <p>{item.value}</p>
                </div>
              </div>
            ))}
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
