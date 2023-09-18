import Endpoints from '@/api/endpoints';
import { superAdminApiClient } from '@/api/superAdminApiClient';
import { SuperAdminUpdateUserRoleRequestDto } from '@/contract/auth/super-admin-update-role.request.dto.d';
import { UserResponseDto } from '@/contract/auth/user.response.dto.d';

export const updateUserRoles = async (
  userId: string,
  values: Omit<SuperAdminUpdateUserRoleRequestDto, 'userId'>,
  superAdminEmail: string,
  superAdminPassword: string
) => {
  return new Promise<UserResponseDto>(async (resolve, reject) => {
    const res = await superAdminApiClient({
      url: Endpoints.admin.updateUserRoles(),
      options: {
        method: 'POST',
        body: JSON.stringify({
          userId,
          ...values,
        }),
      },
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
