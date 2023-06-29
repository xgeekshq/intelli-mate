'use client';

import { useRouter } from 'next/navigation';
import { apiClient } from '@/api/apiClient';
import Endpoints from '@/api/endpoints';
import { JoinRoomRequestDto } from '@/contract/rooms/join-room.request.dto.d';
import { useAuth } from '@clerk/nextjs';
import { getCookie } from 'cookies-next';

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
  const { sessionId } = useAuth();
  const router = useRouter();
  const token = getCookie('__session');
  async function onJoinRoom(values: JoinRoomRequestDto) {
    try {
      const res = await apiClient({
        url: Endpoints.rooms.joinRoom(),
        options: { method: 'POST', body: JSON.stringify(values) },
        sessionId: sessionId ?? '',
        jwtToken: token?.toString() ?? '',
      });
      if (!res.ok) {
        const { error } = JSON.parse(await res.text());
        toast({
          title: error,
          variant: 'destructive',
        });
        return;
      }
      toast({
        title: 'Room joined successfully!',
      });
      router.refresh();
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
              onClick={() => onJoinRoom({ roomId: item.roomId })}
            >
              Join Room
            </Button>
          )}
        </CommandItem>
      ))}
    </>
  );
}
