import { AiModelsRepository } from '@/ai/ai-models.repository';
import { AiModelResponseDto } from '@/ai/dtos/ai-model.response.dto';
import { InternalServerErrorException } from '@/common/exceptions/internal-server-error.exception';
import { Usecase } from '@/common/types/usecase';
import { decrypt } from '@/common/utils/encrypt-string';
import { AiModelResponseSchema } from '@/contract/ai/ai-model.response.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AdminFindAiModelsUsecase implements Usecase {
  constructor(private readonly aiModelsRepository: AiModelsRepository) {}

  async execute(): Promise<AiModelResponseDto[]> {
    try {
      const aiModels = await this.aiModelsRepository.findAll();
      for (const aiModel of aiModels) {
        if (aiModel.meta && aiModel.meta['apiKey']) {
          aiModel.meta['apiKey'] = decrypt(aiModel.meta['apiKey']);
        }
      }
      return aiModels.map((aiModel) => AiModelResponseSchema.parse(aiModel));
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }
}
