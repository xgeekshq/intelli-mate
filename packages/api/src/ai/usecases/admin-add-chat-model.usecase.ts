import { AiModelRepository } from '@/ai/ai-model.repository';
import { AiModelResponseDto } from '@/ai/dtos/ai-model.response.dto';
import { DuplicateChatLlmNameException } from '@/ai/exceptions/duplicate-chat-llm-name.exception';
import { InternalServerErrorException } from '@/common/exceptions/internal-server-error.exception';
import { Usecase } from '@/common/types/usecase';
import { AiModelResponseSchema } from '@/contract/ai/ai-model.response.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AdminAddChatModelUsecase implements Usecase {
  constructor(private readonly aiModelRepository: AiModelRepository) {}

  async execute(
    aiModelResponseDto: AiModelResponseDto
  ): Promise<AiModelResponseDto> {
    const existingAiModel = await this.aiModelRepository.findAiModelByName(
      aiModelResponseDto.chatLlmName.toLowerCase()
    );
    if (existingAiModel) {
      throw new DuplicateChatLlmNameException();
    }

    try {
      const aiModel = await this.aiModelRepository.addAiModel(
        aiModelResponseDto
      );

      return AiModelResponseSchema.parse(aiModel);
    } catch (e) {
      if (e.message.includes('duplicate')) {
        throw new DuplicateChatLlmNameException();
      }
      throw new InternalServerErrorException(e.message);
    }
  }
}
