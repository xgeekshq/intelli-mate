import '@/styles/globals.css';
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
export default function RoomsLayout({ children }: RootLayoutProps) {
  return (
    <div className="flex h-full">
      <Rooms rooms={rooms} />
      <div>{children}</div>
    </div>
  );
}