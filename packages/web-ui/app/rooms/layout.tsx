import '@/styles/globals.css';
import { cookies } from 'next/headers';
import { clerkClient } from '@/api/client';
import { auth } from '@clerk/nextjs';

import { Rooms } from '@/components/rooms';

interface RootLayoutProps {
  children: React.ReactNode;
}

const rooms: any = [
  { name: 'start', private: true },
  { name: 'a', private: false },
  { name: 'b', private: false },
  { name: 'c', private: false },
  { name: 'd', private: false },
  { name: 'end', private: true },
];
export default async function RoomsLayout({ children }: RootLayoutProps) {
  return (
    <div className="flex h-full">
      <Rooms rooms={rooms} />
      <div>{children}</div>
    </div>
  );
}
