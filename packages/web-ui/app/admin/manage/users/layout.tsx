import '@/styles/globals.css';
import { AdminHeader } from '@/components/admin/admin-header';

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function AdminUsersLayout({ children }: RootLayoutProps) {
  return (
    <div className="flex h-full w-full">
      <div className="flex h-full w-full flex-col">
        <AdminHeader id="125" name="Users" />
        <div className="h-[calc(100%-41px)] w-full">{children}</div>
      </div>
    </div>
  );
}
