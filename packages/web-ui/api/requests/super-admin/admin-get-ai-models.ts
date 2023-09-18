import Endpoints from '@/api/endpoints';
import { superAdminApiClient } from '@/api/superAdminApiClient';
import { SuperAdminAiModelResponseDto } from '@/contract/ai/super-admin-ai-model.response.dto.d';

export const ADMIN_GET_AI_MODELS_REQ_KEY = 'admin-ai-models';

export const adminGetAiModels = async (
  superAdminEmail: string,
  superAdminPassword: string
) => {
  return new Promise<SuperAdminAiModelResponseDto[]>(
    async (resolve, reject) => {
      const res = await superAdminApiClient({
        url: Endpoints.admin.getAiModels(),
        options: { method: 'GET' },
        superAdminEmail,
        superAdminPassword,
      });

      if (!res.ok) {
        const { error } = JSON.parse(await res.text());
        return reject(error);
      }

      resolve(await res.json());
    }
  );
};
