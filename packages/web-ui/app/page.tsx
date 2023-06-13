import { Chat } from '@/components/chat';
import { Rooms } from '@/components/rooms';

export default function IndexPage() {
  return (
    <div className="flex h-full">
      <Rooms />
      <Chat />
    </div>
  );
}
