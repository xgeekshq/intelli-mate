import '@/styles/globals.css';
import { AdminHeader } from '@/components/admin/admin-header';

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function AdminUsersLayout({ children }: RootLayoutProps) {
  return (
    <div className="flex size-full">
      <div className="flex size-full flex-col">
        <AdminHeader />
        <div className="h-[calc(100%-97px)] w-full">{children}</div>
      </div>
    </div>
  );
}
