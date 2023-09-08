import { AiModelsRepository } from '@/ai/ai-models.repository';
import { SuperAdminAiModelResponseDto } from '@/ai/dtos/super-admin-ai-model.response.dto';
import { InternalServerErrorException } from '@/common/exceptions/internal-server-error.exception';
import { Usecase } from '@/common/types/usecase';
import { decrypt } from '@/common/utils/encrypt-string';
import { SuperAdminAiModelResponseSchema } from '@/contract/ai/super-admin-ai-model.response.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AdminFindAiModelsUsecase implements Usecase {
  constructor(private readonly aiModelsRepository: AiModelsRepository) {}

  async execute(): Promise<SuperAdminAiModelResponseDto[]> {
    try {
      const aiModels = await this.aiModelsRepository.findAll();
      for (const aiModel of aiModels) {
        if (aiModel.meta && aiModel.meta['apiKey']) {
          aiModel.meta.apiKey = decrypt(aiModel.meta.apiKey);
        }
      }
      return aiModels.map((aiModel) =>
        SuperAdminAiModelResponseSchema.parse(aiModel)
      );
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }
}
