import { SuperAdminAddModelRequestDto } from '@/ai/dtos/super-admin-add-model.request.dto';
import { DB_AI_MODELS_MODEL_KEY } from '@/common/constants/models/ai-model';
import { AiModel } from '@/common/types/ai-models';
import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

@Injectable()
export class AiModelsRepository {
  constructor(
    @Inject(DB_AI_MODELS_MODEL_KEY)
    private aiModelModel: Model<AiModel>
  ) {}

  async findAiModel(id: string): Promise<AiModel> {
    return this.aiModelModel.findById(id);
  }
  async addAiModel(
    superAdminAddModelRequestDto: SuperAdminAddModelRequestDto
  ): Promise<AiModel> {
    const aiModel = new this.aiModelModel({
      ...superAdminAddModelRequestDto,
      chatLlmName: superAdminAddModelRequestDto.chatLlmName.toLowerCase(),
    });
    await aiModel.save();
    return aiModel;
  }
}
