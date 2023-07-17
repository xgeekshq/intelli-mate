import { cookies } from 'next/headers';
import Endpoints from '@/api/endpoints';
import { superAdminApiClient } from '@/api/superAdminApiClient';

const getUsers = async (
  superAdminEmail: string,
  superAdminPassword: string
) => {
  try {
    const res = await superAdminApiClient({
      url: Endpoints.admin.getUsers(),
      options: { method: 'GET' },
      superAdminEmail,
      superAdminPassword,
    });
    return res.json();
  } catch (e) {
    console.log(e);
  }
};

export default async function AdminUsers() {
  const nextCookies = cookies();
  const adminCredentialsCookie = nextCookies.get('__admin');
  const adminCredentials = JSON.parse(adminCredentialsCookie!.value);

  const users = await getUsers(
    adminCredentials.email,
    adminCredentials.password
  );

  console.log(users);

  return <div className="flex h-full w-full p-4">Admin Users</div>;
}
