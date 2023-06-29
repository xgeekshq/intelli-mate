import Chat from '@/components/chat';

export default function Room({ params }: { params: { room: string } }) {
  return (
    <div className="flex h-full flex-col">
      <Chat roomId={params.room}></Chat>
    </div>
  );
}
