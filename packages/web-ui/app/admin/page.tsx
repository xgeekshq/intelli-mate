import { redirect } from 'next/navigation';
import { getSuperAdminCookieOnServer } from '@/utils/get-super-admin-cookie-server';
import { getUrlPath } from '@/utils/get-url-path';

export default async function AdminDashboard() {
  const { adminCredentialsCookie } = getSuperAdminCookieOnServer();
  const { urlPath } = getUrlPath();

  if (adminCredentialsCookie && urlPath === '/admin') {
    redirect('/admin/manage/users');
  }
  return null;
}
