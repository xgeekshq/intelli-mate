import Endpoints from '@/api/endpoints';
import { superAdminApiClient } from '@/api/superAdminApiClient';
import { UserResponseDto } from '@/contract/auth/user.response.dto.d';

export const ADMIN_GET_ALL_USERS_REQ_KEY = 'admin-all-users';

export const adminGetAllUsers = async (
  superAdminEmail: string,
  superAdminPassword: string
) => {
  return new Promise<UserResponseDto[]>(async (resolve, reject) => {
    const res = await superAdminApiClient({
      url: Endpoints.admin.getUsers(),
      options: { method: 'GET' },
      superAdminEmail,
      superAdminPassword,
    });

    if (!res.ok) {
      const { error } = JSON.parse(await res.text());
      return reject(error);
    }

    resolve(await res.json());
  });
};
