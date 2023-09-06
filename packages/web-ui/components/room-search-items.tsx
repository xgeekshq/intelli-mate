'use client';

import { useRouter } from 'next/navigation';
import { apiClient } from '@/api/apiClient';
import Endpoints from '@/api/endpoints';
import { JoinRoomRequestDto } from '@/contract/rooms/join-room.request.dto.d';
import { RoomResponseDto } from '@/contract/rooms/room.response.dto.d';
import { debounce } from '@/utils/debounce';
import { useAuth } from '@clerk/nextjs';

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
  const { sessionId, getToken } = useAuth();
  const router = useRouter();
  async function onJoinRoom(values: JoinRoomRequestDto) {
    try {
      const res = await apiClient({
        url: Endpoints.rooms.joinRoom(),
        options: { method: 'POST', body: JSON.stringify(values) },
        sessionId: sessionId ?? '',
        jwtToken: (await getToken()) ?? '',
      });

      if (!res.ok) {
        const { error } = JSON.parse(await res.text());
        toast({
          title: error,
          variant: 'destructive',
        });
        return;
      }

      const room: RoomResponseDto = await res.json();
      toast({
        title: `Joined ${room.name}, welcome!`,
      });
      // this refresh next server component https://nextjs.org/docs/app/api-reference/functions/use-router
      router.refresh();
      router.push(`/rooms/${room.id}`);
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
