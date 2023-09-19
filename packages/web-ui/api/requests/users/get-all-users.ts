import { apiClient } from '@/api/apiClient';
import Endpoints from '@/api/endpoints';
import { UserResponseDto } from '@/contract/auth/user.response.dto.d';

export const GET_ALL_USERS_REQ_KEY = 'all-users';

export const getAllUsers = async (jwtToken: string | null) => {
  return new Promise<UserResponseDto[]>(async (resolve, reject) => {
    const res = await apiClient({
      url: Endpoints.users.getUsers(),
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
