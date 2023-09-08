'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { apiClient } from '@/api/apiClient';
import Endpoints from '@/api/endpoints';
import { AiModelResponseDto } from '@/contract/ai/ai-model.response.dto.d';
import { RoomResponseDto } from '@/contract/rooms/room.response.dto.d';
import { useAuth } from '@clerk/nextjs';
import { Lock } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CreateRoomForm } from '@/components/create-room-form';

type RoomsProps = {
  rooms: RoomResponseDto[];
};

export function Rooms({ rooms }: RoomsProps) {
  const params = useParams();
  const [aiModels, setAiModels] = useState<AiModelResponseDto[]>([]);

  const { sessionId, getToken } = useAuth();

  async function getAiModels() {
    try {
      const res = await apiClient({
        url: Endpoints.ai.getAiModels(),
        options: { method: 'GET' },
        sessionId: sessionId ?? '',
        jwtToken: (await getToken()) ?? '',
      });
      return res.json();
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    const setInitialData = async () => {
      const aiModels: AiModelResponseDto[] = await getAiModels();
      setAiModels(aiModels);
    };

    void setInitialData();
  }, []);
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
          {rooms.map((room) => (
            <Link key={`${room.id}`} href={`/rooms/${room.id}`}>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-between"
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
