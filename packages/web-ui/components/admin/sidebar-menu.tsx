'use client';

import Link from 'next/link';
import { BrainCircuit, Users } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

export function AdminSidebarMenu() {
  return (
    <div className="flex h-full w-60 flex-col border-r">
      <div className="flex min-h-[41px] items-center justify-between border-b">
        <Link
          className="relative px-4 text-lg font-semibold tracking-tight"
          href={'/admin/manage/users'}
        >
          admin operations
        </Link>
      </div>
      <ScrollArea className="flex-1 p-2">
        <div className="space-y-1">
          <Link key="admin-users" href={`/admin/manage/users`}>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-between"
            >
              <p className="max-w-[140px] overflow-hidden text-clip">users</p>
              <Users className="h-4 w-4" />
            </Button>
          </Link>
          <Link key="admin-ai-models" href={`/admin/manage/ai-models`}>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-between"
            >
              <p className="max-w-[140px] overflow-hidden text-clip">
                ai-models
              </p>
              <BrainCircuit className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </ScrollArea>
    </div>
  );
}
