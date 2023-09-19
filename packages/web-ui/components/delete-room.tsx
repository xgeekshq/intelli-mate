'use client';

import { useRouter } from 'next/navigation';
import { deleteRoom } from '@/api/requests/rooms/delete-room';
import { debounce } from '@/utils/debounce';
import { useAuth } from '@clerk/nextjs';
import { useMutation } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

export default function DeleteRoom({ roomId }: { roomId: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const { getToken } = useAuth();
  const { mutate: deleteRoomMutationReq, isLoading } = useMutation({
    mutationFn: async () => deleteRoom(roomId, await getToken()),
    onError: (error: any) => {
      toast({
        title: error,
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      toast({
        title: 'The room was deleted.',
      });
      router.push('/rooms');
      router.refresh();
    },
  });

  async function onDeleteRoom() {
    try {
      deleteRoomMutationReq();
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div className="flex w-full items-end justify-between">
      <div className="flex flex-col">
        <p className="font-bold">Delete this room</p>
        <p>
          Deleting a room will delete all messages in that room as well as all
          the documents uploaded to that room.
        </p>
      </div>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="destructive" size="lg">
            Delete room
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="flex flex-col gap-4">
            <p>
              Are you sure you want to delete this room? This action is
              permanent.
            </p>
            <Button
              disabled={isLoading}
              onClick={debounce(onDeleteRoom, 500)}
              className="w-1/4 self-end"
              size="sm"
              variant="destructive"
            >
              Delete
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
