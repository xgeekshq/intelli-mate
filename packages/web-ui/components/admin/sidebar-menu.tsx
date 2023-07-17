'use client';

import Link from 'next/link';
import { UsersIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function AdminSidebarMenu() {
  return (
    <div className="flex h-full w-60 flex-col border-r">
      <div className="flex min-h-[41px] items-center justify-between border-b">
        <Link
          className="relative px-4 text-lg font-semibold tracking-tight"
          href={'/admin'}
        >
          Admin Operations
        </Link>
      </div>
      <ScrollArea className="flex-1 p-2">
        <div className="space-y-1">
          <Link key="admin-users" href={`/admin/users`}>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-between"
            >
              <p className="max-w-[140px] overflow-hidden text-clip">Users</p>
              <UsersIcon className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </ScrollArea>
    </div>
  );
}
