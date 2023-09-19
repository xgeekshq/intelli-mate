import { apiClient } from '@/api/apiClient';
import Endpoints from '@/api/endpoints';
import { AiModelResponseDto } from '@/contract/ai/ai-model.response.dto.d';

export const GET_AI_MODELS_REQ_KEY = 'ai-models';

export const getAiModels = async (jwtToken: string | null) => {
  return new Promise<AiModelResponseDto[]>(async (resolve, reject) => {
    const res = await apiClient({
      url: Endpoints.ai.getAiModels(),
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
