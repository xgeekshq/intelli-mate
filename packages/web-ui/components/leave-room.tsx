'use client';

import { useRouter } from 'next/navigation';
import { leaveRoom } from '@/api/requests/rooms/leave-room';
import { LeaveRoomRequestDto } from '@/contract/rooms/leave-room.request.dto.d';
import { debounce } from '@/utils/debounce';
import { useAuth } from '@clerk/nextjs';
import { useMutation } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

export default function LeaveRoom({ roomId }: { roomId: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const { getToken } = useAuth();
  const { mutate: leaveRoomMutationReq, isLoading } = useMutation({
    mutationFn: async (values: LeaveRoomRequestDto) =>
      leaveRoom(values, await getToken()),
    onError: (error: any) => {
      toast({
        title: error,
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      toast({
        title: 'You left the room.',
      });
      router.push('/rooms');
      router.refresh();
    },
  });

  async function onLeaveRoom(values: LeaveRoomRequestDto) {
    try {
      leaveRoomMutationReq(values);
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
          <p>Are you sure you want to leave this room?</p>
          <Button
            disabled={isLoading}
            onClick={debounce(() => onLeaveRoom({ roomId }), 500)}
            className="w-1/4 self-end"
            size="sm"
            variant="destructive"
          >
            Leave
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
