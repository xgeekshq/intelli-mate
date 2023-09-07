import { AiModelsRepository } from '@/ai/ai-models.repository';
import { SuperAdminAddAiModelRequestDto } from '@/ai/dtos/super-admin-add-ai-model.request.dto';
import { SuperAdminAiModelResponseDto } from '@/ai/dtos/super-admin-ai-model.response.dto';
import { InternalServerErrorException } from '@/common/exceptions/internal-server-error.exception';
import { Usecase } from '@/common/types/usecase';
import { SuperAdminAiModelResponseSchema } from '@/contract/ai/super-admin-ai-model.response.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AdminAddAiModelUsecase implements Usecase {
  constructor(private readonly aiModelRepository: AiModelsRepository) {}

  async execute(
    addAiModelRequestDto: SuperAdminAddAiModelRequestDto
  ): Promise<SuperAdminAiModelResponseDto> {
    try {
      const aiModel = await this.aiModelRepository.addAiModel(
        addAiModelRequestDto
      );

      return SuperAdminAiModelResponseSchema.parse(aiModel);
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }
}
