import { AiModelResponseDto } from '@/ai/dtos/ai-model.response.dto';
import { SuperAdminAddModelRequestDto } from '@/ai/dtos/super-admin-add-model.request.dto';
import { AdminAddChatModelUsecase } from '@/ai/usecases/admin-add-chat-model.usecase';
import { UserNotSuperAdminExceptionSchema } from '@/auth/exceptions/user-not-super-admin.exception';
import { ApiSuperAdminAuthHeaders } from '@/auth/guards/super-admin/open-api-super-admin-headers.decorator';
import { SuperAdminAuthGuard } from '@/auth/guards/super-admin/super-admin.auth.guard';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@Controller({ path: 'ai/admin', version: '1' })
@ApiTags('ai/admin')
export class AiAdminController {
  constructor(
    private readonly adminAddChatModelUsecase: AdminAddChatModelUsecase
  ) {}

  @Post('ai-models')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(SuperAdminAuthGuard)
  @ApiSuperAdminAuthHeaders()
  @ApiCreatedResponse({ type: AiModelResponseDto })
  @ApiForbiddenResponse({ schema: UserNotSuperAdminExceptionSchema })
  @ApiOperation({ description: 'Add a new ai chat model' })
  async superAdminAddModel(
    @Body() superAdminAddModelDto: SuperAdminAddModelRequestDto
  ): Promise<AiModelResponseDto> {
    return this.adminAddChatModelUsecase.execute(superAdminAddModelDto);
  }
}
