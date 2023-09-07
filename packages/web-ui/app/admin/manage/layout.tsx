import '@/styles/globals.css';
import { AdminSidebarMenu } from '@/components/admin/sidebar-menu';
import { StateProvider } from '@/components/state-provider';

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function SuperAdminManageLayout({
  children,
}: RootLayoutProps) {
  return (
    <div className="flex h-full w-full">
      <AdminSidebarMenu />
      <StateProvider>{children}</StateProvider>
    </div>
  );
}
