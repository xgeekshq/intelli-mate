'use client';

import Link from 'next/link';
import { Settings } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface RoomHeaderProps {
  name: string;
}

export function RoomHeader({ name }: RoomHeaderProps) {
  return (
    <div className="flex w-full items-center justify-between border-b px-4">
      <p className="relative text-lg font-semibold tracking-tight">{name}</p>
      <Link href={`${name}/settings`}>
        <Button variant="ghost">
          <Settings className="h-5 w-5" />
        </Button>
      </Link>
    </div>
  );
}