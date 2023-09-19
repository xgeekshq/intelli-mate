'use client';

import { useRouter } from 'next/navigation';
import { inviteUserToRoom } from '@/api/requests/rooms/invite-user-to-room';
import { InviteUserToRoomRequestDto } from '@/contract/rooms/invite-user-to-room.request.dto.d';
import { useAuth } from '@clerk/nextjs';
import { useMutation } from '@tanstack/react-query';

import { UserListType } from '@/types/searchList';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { CommandItem } from '@/components/ui/command';
import { useToast } from '@/components/ui/use-toast';

interface UserSearchItemsProps {
  data: UserListType[];
  roomId: string;
  roomOwnerRoles: string[];
  isPrivateRoom: boolean;
}
export default function UserSearchItems({
  data,
  roomId,
  roomOwnerRoles,
  isPrivateRoom,
}: UserSearchItemsProps) {
  const { toast } = useToast();
  const { getToken } = useAuth();
  const router = useRouter();
  const { mutate: inviteUserToRoomMutationReq, isLoading } = useMutation({
    mutationFn: async (values: InviteUserToRoomRequestDto) =>
      inviteUserToRoom(values, await getToken()),
    onError: (error: any) => {
      toast({
        title: error,
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      toast({
        title: 'User successfully invited',
      });
      router.refresh();
    },
  });

  function onInviteUser(values: InviteUserToRoomRequestDto) {
    try {
      inviteUserToRoomMutationReq(values);
    } catch (e) {
      console.log(e);
    }
  }

  const verifyUserRoles = (user: UserListType) => {
    return (
      roomOwnerRoles.length === user.roles.length &&
      roomOwnerRoles.every((role) => user.roles.includes(role))
    );
  };

  return (
    <>
      {data.map((item) => (
        <CommandItem
          className="flex justify-between"
          value={item.value ?? ''}
          key={item.value}
        >
          <div className="flex items-center gap-2 py-1">
            <Avatar className="h-8 w-8">
              <AvatarImage src={item.imageUrl} alt="Profile Avatar" />
            </Avatar>
            <div className="flex flex-col">
              <p className="">{item.value}</p>
            </div>
          </div>
          {verifyUserRoles(item) || !isPrivateRoom ? (
            <Button
              disabled={isLoading}
              size="xs"
              variant="success"
              onClick={() =>
                onInviteUser({
                  userId: item.userId,
                  roomId,
                })
              }
            >
              <span className="text-xs">Invite to room</span>
            </Button>
          ) : (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button size="xs" variant="success">
                  <span className="text-xs">Invite to room</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Are you sure you want to add {item.value} to this chat?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    The user&apos;s current role permissions differ from the
                    room owner. This may lead to unintended breaches of
                    information. We recommend creating a new room and including
                    the user in it. You can still add the user in this room
                    though.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    disabled={isLoading}
                    onClick={() =>
                      onInviteUser({
                        userId: item.userId,
                        roomId,
                      })
                    }
                  >
                    Add anyway
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </CommandItem>
      ))}
    </>
  );
}
