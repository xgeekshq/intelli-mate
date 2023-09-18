import Endpoints from '@/api/endpoints';
import { superAdminApiClient } from '@/api/superAdminApiClient';
import { SuperAdminAddAiModelRequestDto } from '@/contract/ai/super-admin-add-ai-model.request.dto.d';
import { SuperAdminAiModelResponseDto } from '@/contract/ai/super-admin-ai-model.response.dto.d';

export const adminAddAiModel = async (
  values: SuperAdminAddAiModelRequestDto,
  superAdminEmail: string,
  superAdminPassword: string
) => {
  return new Promise<SuperAdminAiModelResponseDto>(async (resolve, reject) => {
    const res = await superAdminApiClient({
      url: Endpoints.admin.addAiModel(),
      options: {
        method: 'POST',
        body: JSON.stringify({
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
