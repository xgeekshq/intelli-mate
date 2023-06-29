import * as React from 'react';
import { useState } from 'react';
import Textarea from 'react-textarea-autosize';

import { Button } from '@/components/ui/button';

export interface PromptProps {
  onSubmit: (value: string) => void;
  isLoading: boolean;
}

export function PromptForm({ onSubmit, isLoading }: PromptProps) {
  const [input, setInput] = useState('');

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        if (!input?.trim()) {
          return;
        }
        setInput('');
        await onSubmit(input);
      }}
      className="flex"
    >
      <div className="relative flex max-h-60 w-full grow flex-col overflow-hidden rounded border bg-background">
        <Textarea
          tabIndex={0}
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Send a message."
          spellCheck={false}
          className="w-full resize-none bg-transparent p-2 focus-within:outline-none sm:text-sm"
        />
      </div>
      <Button type="submit" disabled={isLoading || input === ''}>
        <span className="sr-only">Send message</span>
      </Button>
    </form>
  );
}
