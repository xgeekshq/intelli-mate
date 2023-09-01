import { SuperAdminAddModelRequestDto } from '@/ai/dtos/super-admin-add-model.request.dto';
import { DB_AI_MODELS_MODEL_KEY } from '@/common/constants/models/ai-models';
import { AiModels } from '@/common/types/ai-models';
import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

@Injectable()
export class AiModelRepository {
  constructor(
    @Inject(DB_AI_MODELS_MODEL_KEY)
    private aiModelsModel: Model<AiModels>
  ) {}

  async findAiModelByName(chatLlmName: string): Promise<AiModels> {
    return this.aiModelsModel.findOne({ chatLlmName });
  }
  async addAiModel(
    superAdminAddModelRequestDto: SuperAdminAddModelRequestDto
  ): Promise<AiModels> {
    //TODO: encrypt apiKey
    const aiModel = new this.aiModelsModel({
      ...superAdminAddModelRequestDto,
      chatLlmName: superAdminAddModelRequestDto.chatLlmName.toLowerCase(),
    });
    await aiModel.save();
    return aiModel;
  }
}
