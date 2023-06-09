import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

export function Chat() {
  return (
    <div className="flex h-full flex-col pt-2">
      <h2 className="relative px-6 text-lg font-semibold tracking-tight">
        Topic
      </h2>
      <ScrollArea className="flex-1 px-2">
        <div className="space-y-1 p-2">Chat</div>
      </ScrollArea>
    </div>
  );
}
