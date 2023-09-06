import { SuperAdminAddAiModelRequestDto } from '@/ai/dtos/super-admin-add-ai-model.request.dto';
import { DB_AI_MODELS_MODEL_KEY } from '@/common/constants/models/ai-model';
import { AiModel } from '@/common/types/ai-models';
import { encrypt } from '@/common/utils/encrypt-string';
import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

@Injectable()
export class AiModelsRepository {
  constructor(
    @Inject(DB_AI_MODELS_MODEL_KEY)
    private aiModelModel: Model<AiModel>
  ) {}

  findAiModel(id: string): Promise<AiModel> {
    return this.aiModelModel.findById(id);
  }

  findAll(): Promise<AiModel[]> {
    return this.aiModelModel.find();
  }
  async addAiModel(
    superAdminAddModelRequestDto: SuperAdminAddAiModelRequestDto
  ): Promise<AiModel> {
    const aiModel = new this.aiModelModel({
      ...superAdminAddModelRequestDto,
      meta: {
        ...superAdminAddModelRequestDto.meta,
        ...(superAdminAddModelRequestDto.meta.apiKey
          ? { apiKey: encrypt(superAdminAddModelRequestDto.meta['apiKey']) }
          : {}),
      },
    });
    await aiModel.save();
    return aiModel;
  }
}
