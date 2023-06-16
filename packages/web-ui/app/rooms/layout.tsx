import '@/styles/globals.css';
import { cookies } from 'next/headers';
import { clerkClient } from '@/api/client';
import { auth } from '@clerk/nextjs';

import { Rooms } from '@/components/rooms';

interface RootLayoutProps {
  children: React.ReactNode;
}

const rooms: any = [
  { name: 'Management', private: true },
  { name: 'DDD', private: false },
  { name: 'Frontend', private: false },
  { name: 'ETFs', private: true },
  { name: 'Confluence', private: false },
  { name: 'Ramos-team', private: true },
];
export default async function RoomsLayout({ children }: RootLayoutProps) {
  return (
    <div className="flex h-full">
      <Rooms rooms={rooms} />
      <div className="w-full">{children}</div>
    </div>
  );
}
