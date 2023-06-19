'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { RoomResponseDto } from '@/contract/rooms/room.response.dto.d';
import { Lock } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CreateRoomForm } from '@/components/create-room-form';

type RoomsProps = {
  rooms: RoomResponseDto[];
};
export function Rooms({ rooms }: RoomsProps) {
  const params = useParams();
  return (
    <div className="flex h-full w-40 flex-col border-r pt-2">
      <div className="flex items-center">
        <Link
          className="relative px-6 text-lg font-semibold tracking-tight"
          href={'/rooms'}
        >
          Rooms
        </Link>
        <CreateRoomForm />
      </div>
      <ScrollArea className="flex-1 px-2">
        <div className="space-y-1 p-2">
          {rooms.map((room, i) => (
            <Link key={`${room.name}`} href={`/rooms/${room.name}`}>
              <Button
                variant="ghost"
                size="sm"
                className={`w-full justify-start gap-2 ${
                  room.name === params.room ? 'font-bold' : 'font-normal'
                }`}
              >
                {room.private && <Lock className="h-4 w-4" />}
                {room.name}
              </Button>
            </Link>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
