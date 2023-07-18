'use client';

import { usePathname } from 'next/navigation';

interface RoomHeaderProps {
  id: string;
  name: string;
}

function getTitleByPathname(pathName: string) {
  const parts = pathName.split('/');
  const relevantParts = parts.filter((part) => !part.includes('admin'));
  return relevantParts.join(' ');
}

export function AdminHeader({ id, name }: RoomHeaderProps) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-[41px] w-full items-center justify-between border-b px-4">
      <p className="relative text-lg font-semibold tracking-tight">
        {getTitleByPathname(pathname)}
      </p>
    </div>
  );
}
