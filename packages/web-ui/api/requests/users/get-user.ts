import { apiClient } from '@/api/apiClient';
import Endpoints from '@/api/endpoints';
import { UserResponseDto } from '@/contract/auth/user.response.dto.d';

export const GET_USER_REQ_KEY = 'user';

export const getUser = async (
  userId: string | undefined,
  sessionId: string | null,
  jwtToken: string | null
) => {
  return new Promise<UserResponseDto>(async (resolve, reject) => {
    const res = await apiClient({
      url: Endpoints.users.getUser(userId ?? ''),
      options: { method: 'GET' },
      sessionId,
      jwtToken,
    });

    if (!res.ok) {
      const { error } = JSON.parse(await res.text());
      return reject(error);
    }

    resolve(await res.json());
  });
};
