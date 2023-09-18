import { cookies } from 'next/headers';

export function getSuperAdminCookieOnServer() {
  const nextCookies = cookies();
  const adminCredentialsCookie = nextCookies.get('__admin');

  return {
    adminCredentialsCookie,
  };
}
