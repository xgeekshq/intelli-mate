import '@/styles/globals.css';
import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import Endpoints from '@/api/endpoints';
import { superAdminApiClient } from '@/api/superAdminApiClient';

import { StateProvider } from '@/components/state-provider';

interface RootLayoutProps {
  children: React.ReactNode;
}

const validateSuperAdminCredentials = async (
  email: string,
  password: string
): Promise<boolean> => {
  try {
    const res = await superAdminApiClient({
      url: Endpoints.admin.validateCredentials(),
      options: { method: 'POST', body: JSON.stringify({ email, password }) },
    });
    return res.ok;
  } catch (e) {
    console.log(e);
  }
  return false;
};

export default async function SuperAdminLayout({ children }: RootLayoutProps) {
  const nextCookies = cookies();
  const { get: getHeader } = headers();
  const adminCredentialsCookie = nextCookies.get('__admin');
  const urlPath = getHeader('x-invoke-path');

  // If no cookie credentials -> redirect for login (but if in login already, don't redirect again)
  if (!adminCredentialsCookie && urlPath !== '/admin/login') {
    redirect('/admin/login');
  }

  // If cookie credentials are present -> validate credentials and redirect for login if not valid (clearing the cookie to avoid a loop)
  if (urlPath !== '/admin/login') {
    const credentials = adminCredentialsCookie?.value ?? '{}';
    const adminCredentials = JSON.parse(credentials);

    const isValid = await validateSuperAdminCredentials(
      adminCredentials.email,
      adminCredentials.password
    );

    if (!isValid) {
      redirect('/admin/login');
    }
  }

  return (
    <div className="flex h-full w-full">
      <StateProvider>{children}</StateProvider>
    </div>
  );
}
