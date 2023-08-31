import { AppConfigService } from '@/app-config/app-config.service';
import { AuthRepository } from '@/auth/auth.repository';
import { SuperAdminUpdateUserRoleRequestDto } from '@/auth/dtos/super-admin-update-role.request.dto';
import { RolesNotConfiguredException } from '@/auth/exceptions/roles-not-configured.exception';
import { ClerkAuthUserProvider } from '@/auth/providers/clerk/clerk-auth-user.provider';
import { Usecase } from '@/common/types/usecase';
import { User } from '@/common/types/user';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AdminUpdateUserRolesUsecase implements Usecase {
  constructor(
    private readonly appConfigService: AppConfigService,
    private readonly authRepository: AuthRepository,
    private readonly clerkAuthUserProvider: ClerkAuthUserProvider
  ) {}

  async execute(
    superAdminUpdateUserRoleDto: SuperAdminUpdateUserRoleRequestDto
  ): Promise<User> {
    const roles = await this.appConfigService.getAppRoles();
    const roleKeys = roles.map((role) => role.key);

    if (
      !superAdminUpdateUserRoleDto.roles.every((element) =>
        roleKeys.includes(element)
      )
    ) {
      throw new RolesNotConfiguredException();
    }

    await this.authRepository.assignRolesToUser(
      superAdminUpdateUserRoleDto.userId,
      superAdminUpdateUserRoleDto.roles,
      roles
    );

    return this.clerkAuthUserProvider.findUser(
      superAdminUpdateUserRoleDto.userId
    );
  }
}
