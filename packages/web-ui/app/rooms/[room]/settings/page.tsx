import { GET_ROOM_REQ_KEY, getRoom } from '@/api/requests/rooms/get-room';
import {
  GET_ALL_USERS_REQ_KEY,
  getAllUsers,
} from '@/api/requests/users/get-all-users';
import { GET_USER_REQ_KEY, getUser } from '@/api/requests/users/get-user';
import { GET_USERS_REQ_KEY, getUsers } from '@/api/requests/users/get-users';
import { UserResponseDto } from '@/contract/auth/user.response.dto.d';
import { getUserIdentification } from '@/utils/get-user-identification';
import { auth } from '@clerk/nextjs';
import { Hydrate, dehydrate } from '@tanstack/react-query';

import { UserListType } from '@/types/searchList';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import DeleteRoom from '@/components/delete-room';
import LeaveRoom from '@/components/leave-room';
import { SearchList } from '@/components/search-list';
import { UpdateRoomForm } from '@/components/update-room-form';
import UserSearchItems from '@/components/user-search-items';
import getQueryClient from '@/app/get-query-client';

const getUserList = (users: UserResponseDto[]): UserListType[] => {
  return users.map((user) => {
    const userIdentification = getUserIdentification({
      userId: user.id,
      name:
        user.firstName && user.lastName
          ? `${user.firstName} ${user.lastName}`
          : null,
      userName: user.username,
      imageUrl: user.imageUrl,
      email:
        user.emailAddresses.find(
          (email) => user.primaryEmailAddressId === email.id
        )?.emailAddress ?? '',
    });
    return {
      label: userIdentification,
      value: userIdentification,
      imageUrl: user.imageUrl,
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
  const { userId, getToken } = auth();
  const token = await getToken();
  const queryClient = getQueryClient();
  const room = await queryClient.fetchQuery([GET_ROOM_REQ_KEY], () =>
    getRoom(params.room, token)
  );
  const members = await queryClient.fetchQuery([GET_USERS_REQ_KEY], () =>
    getUsers(room.members, token)
  );
  const allUsers = await queryClient.fetchQuery([GET_ALL_USERS_REQ_KEY], () =>
    getAllUsers(token)
  );
  const owner = await queryClient.fetchQuery([GET_USER_REQ_KEY], () =>
    getUser(room.ownerId, token)
  );

  const dehydratedState = dehydrate(queryClient);

  const userSearchList = getUserList(
    allUsers.filter((user) => !members.some((member) => user.id === member.id))
  );
  const membersSearchList = getUserList(members);
  const isOwner = owner.id === userId;

  return (
    <Hydrate state={dehydratedState}>
      <div className="h-full">
        <div className="flex flex-col gap-4 p-4">
          {isOwner && <UpdateRoomForm room={room} />}
          <div className="flex flex-col gap-2 rounded-lg border p-4">
            <p className="font-bold">Room owner</p>
            <div className="flex gap-4">
              <Avatar className="size-16">
                <AvatarImage src={owner.imageUrl} alt="Profile Image" />
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
                isPrivateRoom={room.isPrivate}
              />
            </SearchList>
          </div>
          <div className="flex flex-col gap-2 rounded-lg border p-4">
            <p className="font-bold">Member list</p>
            <ScrollArea className="flex h-96">
              {membersSearchList.map((item) => (
                <div className="flex items-center gap-4 py-1">
                  <Avatar className="size-8">
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
          {!isOwner && (
            <div className="flex flex-col gap-2 rounded-lg border p-4">
              <p className="font-bold">Room Actions</p>
              <div className="w-60">
                <LeaveRoom roomId={room.id} />
              </div>
            </div>
          )}
          {isOwner && (
            <div className="flex flex-col gap-2 rounded-lg border border-red-500 p-4">
              <p className="font-bold text-red-500">Danger Zone</p>
              <DeleteRoom roomId={room.id} />
            </div>
          )}
        </div>
      </div>
    </Hydrate>
  );
}
