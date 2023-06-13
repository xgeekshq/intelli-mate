import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function Room({ params }: { params: { room: string } }) {
  return (
    <div className="flex h-full">
      <h2 className="relative px-6 text-lg font-semibold tracking-tight">
        {params.room}
      </h2>
      <ScrollArea className="flex-1 px-2">
        <div className="space-y-1 p-2">Chat</div>
      </ScrollArea>
      <Link href={`${params.room}/settings`}>
        <Button>Settings</Button>
      </Link>
    </div>
  );
}
