import { SuperAdminLoginRequestDto } from '@/auth/dtos/super-admin-login.request.dto';
import { SuperAdminUpdateUserRoleRequestDto } from '@/auth/dtos/super-admin-update-role.request.dto';
import { UserResponseDto } from '@/auth/dtos/user.response.dto';
import { RolesNotConfiguredExceptionSchema } from '@/auth/exceptions/roles-not-configured.exception';
import { UserNotSuperAdminExceptionSchema } from '@/auth/exceptions/user-not-super-admin.exception';
import { ApiSuperAdminAuthHeaders } from '@/auth/guards/super-admin/open-api-super-admin-headers.decorator';
import { SuperAdminAuthGuard } from '@/auth/guards/super-admin/super-admin.auth.guard';
import { ClerkAuthUserProvider } from '@/auth/providers/clerk/clerk-auth-user.provider';
import { AdminUpdateUserRolesUsecase } from '@/auth/usecases/admin-update-user-roles.usecase';
import { AdminValidateCredentialsUsecase } from '@/auth/usecases/admin-validate-credentials.usecase';
import { UserResponseSchema } from '@/contract/auth/user.response.dto';
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
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@Controller({ path: 'auth/admin', version: '1' })
@ApiTags('auth/admin')
export class AuthAdminController {
  constructor(
    private readonly clerkAuthUserProvider: ClerkAuthUserProvider,
    private readonly adminValidateCredentialsUsecase: AdminValidateCredentialsUsecase,
    private readonly adminUpdateUserRolesUsecase: AdminUpdateUserRolesUsecase
  ) {}

  @Post('validate-credentials')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiForbiddenResponse({ schema: UserNotSuperAdminExceptionSchema })
  @ApiNoContentResponse({ description: 'No content' })
  @ApiOperation({
    description: 'Validate the super admin login',
  })
  async superAdminValidateCredentials(
    @Body() superAdminLoginRequestDto: SuperAdminLoginRequestDto
  ): Promise<void> {
    return this.adminValidateCredentialsUsecase.execute(
      superAdminLoginRequestDto
    );
  }

  @Get('users')
  @UseGuards(SuperAdminAuthGuard)
  @ApiSuperAdminAuthHeaders()
  @ApiOkResponse({ type: UserResponseDto, isArray: true })
  @ApiForbiddenResponse({ schema: UserNotSuperAdminExceptionSchema })
  @ApiOperation({ description: 'Get the user list for the super admin' })
  async superAdminFindUsers(): Promise<UserResponseDto[]> {
    const userList = await this.clerkAuthUserProvider.findUsers(undefined);
    return userList.map((user) => UserResponseSchema.parse(user));
  }

  @Post('update-user-roles')
  @HttpCode(HttpStatus.OK)
  @UseGuards(SuperAdminAuthGuard)
  @ApiSuperAdminAuthHeaders()
  @ApiOkResponse({ type: UserResponseDto })
  @ApiBadRequestResponse({ schema: RolesNotConfiguredExceptionSchema })
  @ApiForbiddenResponse({ schema: UserNotSuperAdminExceptionSchema })
  @ApiOperation({ description: 'Update the roles of a user' })
  async superAdminUpdateUserRoles(
    @Body() superAdminUpdateUserRoleDto: SuperAdminUpdateUserRoleRequestDto
  ): Promise<UserResponseDto> {
    const user = await this.adminUpdateUserRolesUsecase.execute(
      superAdminUpdateUserRoleDto
    );
    return UserResponseSchema.parse(user);
  }
}
