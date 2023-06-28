'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { RoomResponseDto } from '@/contract/rooms/room.response.dto.d';
import { Lock } from 'lucide-react';
import { useRecoilValue } from 'recoil';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CreateRoomForm } from '@/components/create-room-form';
import Error from '@/app/rooms/[room]/settings/error';
import { socketState } from '@/app/state/socket';

type RoomsProps = {
  rooms: RoomResponseDto[];
};

export function Rooms({ rooms }: RoomsProps) {
  const socket = useRecoilValue(socketState);
  const params = useParams();
  const joinRoom = (roomId: string) => {
    socket.emit('joinRoom', { data: { roomId } }, async (response: string) => {
      if (!response) {
        return <Error error={'e'} reset={() => console.log('Error')}></Error>;
      }
    });
  };

  return (
    <div className="flex h-full w-60 flex-col border-r">
      <div className="flex items-center justify-between border-b">
        <Link
          className="relative px-4 text-lg font-semibold tracking-tight"
          href={'/rooms'}
        >
          Rooms
        </Link>
        <CreateRoomForm />
      </div>
      <ScrollArea className="flex-1 p-2">
        <div className="space-y-1">
          {rooms.map((room) => (
            <Link key={`${room.id}`} href={`/rooms/${room.id}`}>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-between"
                onClick={() => joinRoom(room.id)}
              >
                <p
                  className={`max-w-[140px] overflow-hidden text-clip ${
                    room.id === params.room ? 'font-bold' : 'font-normal'
                  }`}
                >
                  {room.name}
                </p>
                {room.isPrivate && <Lock className="h-4 w-4" />}
              </Button>
            </Link>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
