'use client';

import React from 'react';

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';

type HoverableTableCellProps = {
  text: string;
};

export function HoverableTableCell({ text }: HoverableTableCellProps) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <p className="w-[140px] truncate">{text}</p>
      </HoverCardTrigger>
      <HoverCardContent>
        <div className="flex justify-between space-x-4">{text}</div>
      </HoverCardContent>
    </HoverCard>
  );
}
