'use client';

import React, { useState } from 'react';

import { ChatMessageSourceType } from '@/types/chat';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

type DocumentSnippetsProps = {
  source: ChatMessageSourceType;
};

export function DocumentSnippets({ source }: DocumentSnippetsProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <p className="cursor-pointer text-sm text-gray-500 underline">
          {source.filename}
        </p>
      </DialogTrigger>
      <DialogContent className="overflow-y-scroll sm:max-h-[650px] sm:max-w-[900px]">
        <DialogHeader>
          <DialogTitle>
            This answer was based on the following snippets
          </DialogTitle>
        </DialogHeader>
        <>
          {source.snippets.map((snippet, index) => {
            return <p key={index}>{snippet}</p>;
          })}
        </>
      </DialogContent>
    </Dialog>
  );
}
