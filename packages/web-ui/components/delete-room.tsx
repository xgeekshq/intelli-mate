'use client';

import { useRouter } from 'next/navigation';
import { apiClient } from '@/api/apiClient';
import Endpoints from '@/api/endpoints';
import { useAuth } from '@clerk/nextjs';
import { getCookie } from 'cookies-next';

import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

export default function DeleteRoom({ roomId }: { roomId: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const { sessionId } = useAuth();
  const token = getCookie('__session');
  async function onDeleteRoom() {
    try {
      const res = await apiClient({
        url: Endpoints.rooms.deleteRoom(roomId),
        options: { method: 'DELETE' },
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
        <div className="flex w-full items-end justify-between">
          <div className="flex flex-col">
            <p className="font-bold">Delete this room</p>
            <p>
              Once you delete a room, there is no going back. Please be certain.
            </p>
          </div>
          <Button variant="destructive" size="lg">
            Delete room
          </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="flex flex-col gap-4">
          <p>
            Are you sure you want to delete this room? This action will delete
            all the data associated to this room including messages, history and
            documents.
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
  );
}
