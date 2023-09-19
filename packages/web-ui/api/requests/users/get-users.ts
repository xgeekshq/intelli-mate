import { apiClient } from '@/api/apiClient';
import Endpoints from '@/api/endpoints';
import { UserResponseDto } from '@/contract/auth/user.response.dto.d';

export const GET_USERS_REQ_KEY = 'users';

export const getUsers = async (
  userIds: string[] | undefined,
  jwtToken: string | null
) => {
  return new Promise<UserResponseDto[]>(async (resolve, reject) => {
    const res = await apiClient({
      url: Endpoints.users.getUsers(userIds ?? []),
      options: { method: 'GET' },
      jwtToken,
    });

    if (!res.ok) {
      const { error } = JSON.parse(await res.text());
      return reject(error);
    }

    resolve(await res.json());
  });
};
