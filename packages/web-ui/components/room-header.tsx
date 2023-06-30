'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Settings } from 'lucide-react';

import { Button } from '@/components/ui/button';

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
      <p className="relative text-lg font-semibold tracking-tight">
        {isSettingsPage ? `${name} - settings` : name}
      </p>
      {!isSettingsPage && (
        <Link href={`${id}/settings`}>
          <Button variant="ghost">
            <Settings className="h-5 w-5" />
          </Button>
        </Link>
      )}
    </div>
  );
}
