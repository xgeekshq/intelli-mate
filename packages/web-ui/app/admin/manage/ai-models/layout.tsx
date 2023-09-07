import '@/styles/globals.css';
import { ReactNode } from 'react';

import { AdminHeader } from '@/components/admin/admin-header';

export default function AdminUsersLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { room: string };
}) {
  return (
    <div className="flex h-full w-full">
      <div className="flex h-full w-full flex-col">
        <AdminHeader id="125" name="Users" />
        <div className="h-[calc(100%-97px)] w-full">{children}</div>
      </div>
    </div>
  );
}