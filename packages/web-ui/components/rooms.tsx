import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CreateRoomForm } from '@/components/create-room-form';

import { Room } from '../../types/room';

const rooms = [
  'inicio',
  'b',
  'c',
  'd',
  'a',
  'b',
  'c',
  'd',
  'a',
  'b',
  'c',
  'd',
  'a',
  'b',
  'c',
  'd',
  'a',
  'b',
  'c',
  'd',
  'a',
  'b',
  'c',
  'd',
  'a',
  'b',
  'c',
  'd',
  'a',
  'b',
  'c',
  'd',
  'a',
  'b',
  'c',
  'd',
  'a',
  'b',
  'c',
  'd',
  'a',
  'b',
  'c',
  'd',
  'a',
  'b',
  'c',
  'd',
  'a',
  'b',
  'c',
  'd',
  'a',
  'b',
  'c',
  'fim',
];

export function Rooms() {
  const handleSubmit = async (values: Room) => {
    console.log(values);
  };

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
          {rooms?.map((playlist, i) => (
            <Button
              key={`${playlist}-${i}`}
              variant="ghost"
              size="sm"
              className="w-full justify-start font-normal"
            >
              {playlist}
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
