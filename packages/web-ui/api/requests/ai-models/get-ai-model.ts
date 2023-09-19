import { apiClient } from '@/api/apiClient';
import Endpoints from '@/api/endpoints';
import { AiModelResponseDto } from '@/contract/ai/ai-model.response.dto.d';

export const GET_AI_MODEL_REQ_KEY = 'ai-model';

export const getAiModel = async (
  aiModelId: string,
  jwtToken: string | null
) => {
  return new Promise<AiModelResponseDto>(async (resolve, reject) => {
    const res = await apiClient({
      url: Endpoints.ai.getAiModel(aiModelId),
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
