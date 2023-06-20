import { ScrollArea } from '@/components/ui/scroll-area';
import { RoomHeader } from '@/components/room-header';

export default function Room({ params }: { params: { room: string } }) {
  return (
    <div className="flex h-full flex-col">
      <RoomHeader name={params.room} />
      <ScrollArea className="flex-1">
        <div className="space-y-1 p-2">Chat</div>
      </ScrollArea>
    </div>
  );
}
