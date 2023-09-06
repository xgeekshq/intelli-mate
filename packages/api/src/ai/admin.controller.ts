import { AiModelResponseDto } from '@/ai/dtos/ai-model.response.dto';
import { SuperAdminAddAiModelRequestDto } from '@/ai/dtos/super-admin-add-ai-model.request.dto';
import { AdminAddChatModelUsecase } from '@/ai/usecases/admin-add-chat-model.usecase';
import { AdminFindAiModelsUsecase } from '@/ai/usecases/admin-find-ai-models.usecase';
import { UserNotSuperAdminExceptionSchema } from '@/auth/exceptions/user-not-super-admin.exception';
import { ApiSuperAdminAuthHeaders } from '@/auth/guards/super-admin/open-api-super-admin-headers.decorator';
import { SuperAdminAuthGuard } from '@/auth/guards/super-admin/super-admin.auth.guard';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@Controller({ path: 'ai/admin', version: '1' })
@ApiTags('ai/admin')
export class AiAdminController {
  constructor(
    private readonly adminAddChatModelUsecase: AdminAddChatModelUsecase,
    private readonly adminFindAiModelsUsecase: AdminFindAiModelsUsecase
  ) {}

  @Get('ai-models')
  @UseGuards(SuperAdminAuthGuard)
  @ApiSuperAdminAuthHeaders()
  @ApiOkResponse({ type: AiModelResponseDto, isArray: true })
  @ApiForbiddenResponse({ schema: UserNotSuperAdminExceptionSchema })
  @ApiOperation({ description: 'Get the AI Model list for the super admin' })
  async superAdminFindAiModels(): Promise<AiModelResponseDto[]> {
    return this.adminFindAiModelsUsecase.execute();
  }

  @Post('ai-models')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(SuperAdminAuthGuard)
  @ApiSuperAdminAuthHeaders()
  @ApiCreatedResponse({ type: AiModelResponseDto })
  @ApiForbiddenResponse({ schema: UserNotSuperAdminExceptionSchema })
  @ApiOperation({ description: 'Add a new ai chat model' })
  async superAdminAddAiModel(
    @Body() superAdminAddAiModelDto: SuperAdminAddAiModelRequestDto
  ): Promise<any> {
    return this.adminAddChatModelUsecase.execute(superAdminAddAiModelDto);
  }
}
