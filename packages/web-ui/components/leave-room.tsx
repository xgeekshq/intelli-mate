'use client';

import { useRouter } from 'next/navigation';
import { apiClient } from '@/api/apiClient';
import Endpoints from '@/api/endpoints';
import { LeaveRoomRequestDto } from '@/contract/rooms/leave-room.request.dto.d';
import { useAuth } from '@clerk/nextjs';
import { getCookie } from 'cookies-next';

import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

export default function LeaveRoom({ roomId }: { roomId: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const { sessionId } = useAuth();
  const token = getCookie('__session');
  async function onLeaveRoom(values: LeaveRoomRequestDto) {
    try {
      const res = await apiClient({
        url: Endpoints.rooms.leaveRoom(),
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
        title: 'You left the room.',
      });
      router.push('/rooms');
      router.refresh();
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="destructive" size="lg">
          Leave room
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="flex flex-col gap-4">
          <p className="text-sm">Are you sure you want to leave this room?</p>
          <Button
            onClick={() => onLeaveRoom({ roomId })}
            className="w-1/4 self-end"
            size="sm"
            variant="success"
          >
            Yes
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
