'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowLeft, Settings } from 'lucide-react';

interface RoomHeaderProps {
  id: string;
  name: string;
}

export function RoomHeader({ id, name }: RoomHeaderProps) {
  const pathname = usePathname();

  // TODO: this will need a refactor to have a mapper for every route in app
  const isSettingsPage = pathname.includes('settings');
  return (
    <div className="flex min-h-[41px] w-full items-center justify-between border-b px-4">
      <p className="text-lg font-semibold tracking-tight">
        {isSettingsPage ? `${name} | settings` : name}
      </p>
      {isSettingsPage && (
        <Link
          href={`/rooms/${id}`}
          className="flex items-center gap-1 font-semibold tracking-tight"
        >
          <ArrowLeft className="h-5 w-5" />
          back to chat
        </Link>
      )}
      {!isSettingsPage && (
        <Link href={`${id}/settings`}>
          <Settings className="h-5 w-5" />
        </Link>
      )}
    </div>
  );
}
