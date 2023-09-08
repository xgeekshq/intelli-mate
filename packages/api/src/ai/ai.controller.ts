import { AiModelResponseDto } from '@/ai/dtos/ai-model.response.dto';
import { FindAiModelUsecase } from '@/ai/usecases/find-ai-model.usecase';
import { FindAiModelsUsecase } from '@/ai/usecases/find-ai-models.usecase';
import { ClerkAuthGuard } from '@/auth/guards/clerk/clerk.auth.guard';
import { ApiClerkAuthHeaders } from '@/auth/guards/clerk/open-api-clerk-headers.decorator';
import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller({ path: 'ai', version: '1' })
@ApiTags('ai')
@UseGuards(ClerkAuthGuard)
export class AiController {
  constructor(
    private readonly findAiModelsUsecase: FindAiModelsUsecase,
    private readonly findAiModelUsecase: FindAiModelUsecase
  ) {}

  @Get('ai-models')
  @ApiClerkAuthHeaders()
  @ApiOkResponse({ type: AiModelResponseDto, isArray: true })
  @ApiOperation({ description: 'Get the AI Model list for all users' })
  async findAiModels(): Promise<AiModelResponseDto[]> {
    return this.findAiModelsUsecase.execute();
  }

  @Get('ai-models/:id')
  @ApiClerkAuthHeaders()
  @ApiOkResponse({ type: AiModelResponseDto })
  @ApiOperation({ description: 'Get an AI Model' })
  async findAiModel(@Param('id') id: string): Promise<AiModelResponseDto> {
    return this.findAiModelUsecase.execute(id);
  }
}
