'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  GET_AI_MODELS_REQ_KEY,
  getAiModels,
} from '@/api/requests/ai-models/get-ai-models';
import {
  GET_MY_ROOMS_REQ_KEY,
  getMyRooms,
} from '@/api/requests/rooms/get-my-rooms';
import { useAuth } from '@clerk/nextjs';
import { useQuery } from '@tanstack/react-query';
import { Lock } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CreateRoomForm } from '@/components/create-room-form';

export function Rooms() {
  const params = useParams();
  const { getToken } = useAuth();
  const { data: myRooms } = useQuery({
    queryKey: [GET_MY_ROOMS_REQ_KEY],
    queryFn: async () => getMyRooms(await getToken()),
  });
  const { data: aiModels } = useQuery({
    queryKey: [GET_AI_MODELS_REQ_KEY],
    queryFn: async () => getAiModels(await getToken()),
  });

  return (
    <div className="flex h-full w-60 min-w-[220px] flex-col border-r">
      <div className="flex items-center justify-between border-b">
        <Link
          className="relative px-4 text-lg font-semibold tracking-tight"
          href={'/rooms'}
        >
          Rooms
        </Link>
        <CreateRoomForm aiModels={aiModels} />
      </div>
      <ScrollArea className="flex-1 p-2">
        <div className="space-y-1">
          {myRooms?.map((room) => (
            <HoverCard key={room.id}>
              <HoverCardTrigger asChild>
                <Link href={`/rooms/${room.id}`}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-between"
                  >
                    <p
                      className={`w-[140px] truncate text-left ${
                        room.id === params.room ? 'font-bold' : 'font-normal'
                      }`}
                    >
                      {room.name}
                    </p>
                    {room.isPrivate && <Lock className="h-4 w-4" />}
                  </Button>
                </Link>
              </HoverCardTrigger>
              <HoverCardContent>
                <div>{room.name}</div>
              </HoverCardContent>
            </HoverCard>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
