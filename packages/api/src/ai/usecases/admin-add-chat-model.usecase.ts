import { AiModelsRepository } from '@/ai/ai-models.repository';
import { AiModelResponseDto } from '@/ai/dtos/ai-model.response.dto';
import { SuperAdminAddModelRequestDto } from '@/ai/dtos/super-admin-add-model.request.dto';
import { InternalServerErrorException } from '@/common/exceptions/internal-server-error.exception';
import { Usecase } from '@/common/types/usecase';
import { AiModelResponseSchema } from '@/contract/ai/ai-model.response.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AdminAddChatModelUsecase implements Usecase {
  constructor(private readonly aiModelRepository: AiModelsRepository) {}

  async execute(
    aiModelRequestDto: SuperAdminAddModelRequestDto
  ): Promise<AiModelResponseDto> {
    try {
      const aiModel = await this.aiModelRepository.addAiModel(
        aiModelRequestDto
      );

      return AiModelResponseSchema.parse(aiModel);
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }
}
