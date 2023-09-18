import { getCookie } from 'cookies-next';

export function getSuperAdminCookieOnClient() {
  let adminCredentialsCookie: { email: string; password: string } | undefined =
    undefined;
  const cookie = getCookie('__admin');

  if (cookie) {
    adminCredentialsCookie = JSON.parse(cookie.toString());
  }

  return {
    adminCredentialsCookie,
  };
}
