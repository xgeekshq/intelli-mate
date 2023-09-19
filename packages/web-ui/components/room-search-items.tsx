'use client';

import { useRouter } from 'next/navigation';
import { joinRoom } from '@/api/requests/rooms/join-room';
import { JoinRoomRequestDto } from '@/contract/rooms/join-room.request.dto.d';
import { debounce } from '@/utils/debounce';
import { useAuth } from '@clerk/nextjs';
import { useMutation } from '@tanstack/react-query';

import { PublicRoomsListType } from '@/types/searchList';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CommandItem } from '@/components/ui/command';
import { useToast } from '@/components/ui/use-toast';

export default function RoomSearchItems({
  data,
}: {
  data: PublicRoomsListType[];
}) {
  const { toast } = useToast();
  const { getToken } = useAuth();
  const router = useRouter();
  const { mutate: joinRoomMutationReq, isLoading } = useMutation({
    mutationFn: async (values: JoinRoomRequestDto) =>
      joinRoom(values, await getToken()),
    onError: (error: any) => {
      toast({
        title: error,
        variant: 'destructive',
      });
    },
    onSuccess: (room) => {
      toast({
        title: `Joined ${room.name}, welcome!`,
      });
      // this refresh next server component https://nextjs.org/docs/app/api-reference/functions/use-router
      router.refresh();
      router.push(`/rooms/${room.id}`);
    },
  });

  async function onJoinRoom(values: JoinRoomRequestDto) {
    try {
      joinRoomMutationReq(values);
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <>
      {data.map((item) => (
        <CommandItem
          className="flex w-full justify-between hover:cursor-pointer"
          value={item.value ?? ''}
          key={item.value}
        >
          {item.label}
          {item.isMember ? (
            <Badge variant="outline">Already joined</Badge>
          ) : (
            <Button
              disabled={isLoading}
              size="xs"
              variant="success"
              onClick={debounce(() => onJoinRoom({ roomId: item.roomId }), 500)}
            >
              <span className="text-xs">Join Room</span>
            </Button>
          )}
        </CommandItem>
      ))}
    </>
  );
}
