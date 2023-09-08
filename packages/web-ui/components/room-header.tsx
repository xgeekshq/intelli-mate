'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ArrowLeft, Command, Settings } from 'lucide-react';

import { useBrowserInfo } from '@/hooks/use-browser-info';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';

interface RoomHeaderProps {
  id: string;
  name: string;
}

export function RoomHeader({ id, name }: RoomHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isMacUser } = useBrowserInfo();

  const isSettingsPage = pathname.includes('settings');
  useEffect(() => {
    if (!isSettingsPage) {
      const down = (e: KeyboardEvent) => {
        if (e.key === ',' && (e.metaKey || e.ctrlKey)) {
          e.preventDefault();
          router.push(`${id}/settings`);
        }
      };
      document.addEventListener('keydown', down);

      return () => document.removeEventListener('keydown', down);
    }
  }, [isSettingsPage]);
  return (
    <div className="flex min-h-[41px] w-full items-center justify-between border-b px-4">
      {isSettingsPage ? (
        <Link
          href={`/rooms/${id}`}
          className="flex items-center gap-1 font-semibold tracking-tight"
        >
          <ArrowLeft className="h-5 w-5" />
          {name} | settings
        </Link>
      ) : (
        <p className="text-lg font-semibold tracking-tight">{name}</p>
      )}
      {!isSettingsPage && (
        <HoverCard>
          <HoverCardTrigger asChild>
            <Link href={`${id}/settings`}>
              <Settings className="h-5 w-5" />
            </Link>
          </HoverCardTrigger>
          <HoverCardContent
            side="bottom"
            className={`${isMacUser ? 'w-40' : 'w-44'}`}
          >
            <div className="flex items-center justify-between">
              <p className="text-xs">Room settings</p>
              <div className="flex items-center gap-1 rounded-lg border bg-gray-200 p-1 dark:bg-gray-700">
                {isMacUser ? (
                  <>
                    <Command height={10} width={10} />
                    <p className="text-xs">,</p>
                  </>
                ) : (
                  <p className="text-xs">Ctrl + ,</p>
                )}
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      )}
    </div>
  );
}
