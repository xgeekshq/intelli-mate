import { Lock } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CreateRoomForm } from '@/components/create-room-form';

const rooms: any[] = [
  { name: 'start', private: true },
  { name: 'a', private: false },
  { name: 'b', private: false },
  { name: 'c', private: false },
  { name: 'd', private: false },
  { name: 'end', private: true },
];

export function Rooms() {
  return (
    <div className="flex h-full w-40 flex-col border-r pt-2">
      <div className="flex items-center">
        <h2 className="relative px-6 text-lg font-semibold tracking-tight">
          Rooms
        </h2>
        <CreateRoomForm />
      </div>
      <ScrollArea className="flex-1 px-2">
        <div className="space-y-1 p-2">
          {rooms?.map((room, i) => (
            <Button
              key={`${room}-${i}`}
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-2 font-normal"
            >
              {room.private && <Lock className="h-4 w-4" />}
              {room.name}
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
