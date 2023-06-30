import { useEffect, useRef, useState } from 'react';
import { Send } from 'lucide-react';
import Textarea from 'react-textarea-autosize';

import { Button } from '@/components/ui/button';

export interface MessageFormProps {
  onSubmit: (value: string) => Promise<void>;
  scrollToBottom: () => void;
}

export function MessageForm({ onSubmit, scrollToBottom }: MessageFormProps) {
  const [input, setInput] = useState('');
  const formRef = useRef<HTMLFormElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textAreaRef?.current) {
      textAreaRef.current.focus();
    }
  }, [textAreaRef.current]);

  useEffect(() => {
    if (formRef?.current) {
      scrollToBottom();
    }
  }, [formRef.current?.scrollHeight]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.shiftKey && event.key === 'Enter') {
      return;
    }
    if (event.key === 'Enter' && formRef?.current) {
      event.preventDefault();
      // formRef.current.submit();
      formRef.current.dispatchEvent(
        new Event('submit', { cancelable: true, bubbles: true })
      );
    }
  };
  return (
    <form
      ref={formRef}
      onSubmit={async (e) => {
        e.preventDefault();
        if (!input?.trim()) {
          return;
        }
        setInput('');
        await onSubmit(input);
      }}
      className="flex items-end gap-2"
    >
      <div className="relative flex max-h-60 w-full grow flex-col overflow-hidden rounded border bg-background">
        <Textarea
          ref={textAreaRef}
          tabIndex={0}
          rows={1}
          onChange={(e) => setInput(e.target.value)}
          value={input}
          placeholder="Send a message..."
          spellCheck={false}
          className="w-full resize-none bg-transparent p-2 text-sm focus-within:outline-none"
          onKeyDown={handleKeyDown}
        />
      </div>
      <Button type="submit" variant="ghost" disabled={input === ''}>
        <Send className="h-5 w-5 rotate-45" />
      </Button>
    </form>
  );
}
