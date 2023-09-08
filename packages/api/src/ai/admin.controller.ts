import { SuperAdminAddAiModelRequestDto } from '@/ai/dtos/super-admin-add-ai-model.request.dto';
import { SuperAdminAiModelResponseDto } from '@/ai/dtos/super-admin-ai-model.response.dto';
import { AdminAddAiModelUsecase } from '@/ai/usecases/admin-add-ai-model.usecase';
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
    private readonly adminAddChatModelUsecase: AdminAddAiModelUsecase,
    private readonly adminFindAiModelsUsecase: AdminFindAiModelsUsecase
  ) {}

  @Get('ai-models')
  @UseGuards(SuperAdminAuthGuard)
  @ApiSuperAdminAuthHeaders()
  @ApiOkResponse({ type: SuperAdminAiModelResponseDto, isArray: true })
  @ApiForbiddenResponse({ schema: UserNotSuperAdminExceptionSchema })
  @ApiOperation({ description: 'Get the AI Model list for the super admin' })
  async superAdminFindAiModels(): Promise<SuperAdminAiModelResponseDto[]> {
    return this.adminFindAiModelsUsecase.execute();
  }

  @Post('ai-models')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(SuperAdminAuthGuard)
  @ApiSuperAdminAuthHeaders()
  @ApiCreatedResponse({ type: SuperAdminAiModelResponseDto })
  @ApiForbiddenResponse({ schema: UserNotSuperAdminExceptionSchema })
  @ApiOperation({ description: 'Add a new ai chat model' })
  async superAdminAddAiModel(
    @Body() superAdminAddAiModelDto: SuperAdminAddAiModelRequestDto
  ): Promise<any> {
    return this.adminAddChatModelUsecase.execute(superAdminAddAiModelDto);
  }
}
