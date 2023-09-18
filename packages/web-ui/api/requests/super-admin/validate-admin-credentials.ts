import Endpoints from '@/api/endpoints';
import { superAdminApiClient } from '@/api/superAdminApiClient';
import { SuperAdminValidateCredentialsRequestDto } from '@/contract/auth/super-admin-validate-credentials.request.dto.d';

export const validateAdminCredentials = async (
  values: SuperAdminValidateCredentialsRequestDto
) => {
  return new Promise<void>(async (resolve, reject) => {
    const res = await superAdminApiClient({
      url: Endpoints.admin.validateCredentials(),
      options: { method: 'POST', body: JSON.stringify(values) },
    });

    if (!res.ok) {
      const { error } = JSON.parse(await res.text());
      return reject(error);
    }

    resolve();
  });
};
