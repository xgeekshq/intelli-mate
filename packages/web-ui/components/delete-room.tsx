'use client';

import { useRouter } from 'next/navigation';
import { apiClient } from '@/api/apiClient';
import Endpoints from '@/api/endpoints';
import { useAuth } from '@clerk/nextjs';

import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

export default function DeleteRoom({ roomId }: { roomId: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const { sessionId, getToken } = useAuth();
  async function onDeleteRoom() {
    try {
      const res = await apiClient({
        url: Endpoints.rooms.deleteRoom(roomId),
        options: { method: 'DELETE' },
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
              onClick={onDeleteRoom}
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
