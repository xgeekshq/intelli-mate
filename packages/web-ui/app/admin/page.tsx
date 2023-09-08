import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function AdminDashboard() {
  const nextCookies = cookies();
  const { get: getHeader } = headers();
  const adminCredentialsCookie = nextCookies.get('__admin');
  const urlPath = getHeader('x-invoke-path');
  if (adminCredentialsCookie && urlPath === '/admin') {
    redirect('/admin/manage/users');
  }
  return null;
}
