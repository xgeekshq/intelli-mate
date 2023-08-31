import 'dotenv/config';
import { AppConfigService } from '@/app-config/app-config.service';
import { AuthRepository } from '@/auth/auth.repository';
import { AuthProvider } from '@/auth/providers/auth-provider';
import { User } from '@/common/types/user';
import { users } from '@clerk/clerk-sdk-node';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ClerkAuthUserProvider implements AuthProvider {
  constructor(
    private readonly appConfigService: AppConfigService,
    private readonly authRepository: AuthRepository
  ) {}

  async findUser(id: string): Promise<User | undefined> {
    const userRoles = await this.authRepository.findUserRolesForSingleUser(id);
    const user = await users.getUser(id);
    return {
      ...user,
      roles: userRoles.roles,
    };
  }

  async findUsers(ids: string[] | undefined): Promise<User[]> {
    const userRolesList = await this.authRepository.findUserRolesForMultiUsers(
      ids
    );

    // FIXME: get around the limit imposed by clerk when pagination is implemented
    const userList = await users.getUserList(
      ids ? { userId: ids, limit: 100 } : { limit: 100 }
    );

    return userList.map((user) => ({
      ...user,
      roles:
        userRolesList.find((userRoles) => userRoles.userId === user.id)
          ?.roles ?? [],
    }));
  }

  async assignRolesToUser(id: string, roles: string[]): Promise<void> {
    const allRoles = await this.appConfigService.getAppRoles();
    await this.authRepository.assignRolesToUser(id, roles, allRoles);
  }

  async assignDefaultRoleToUser(id: string): Promise<void> {
    const allRoles = await this.appConfigService.getAppRoles();
    const defaultRole = this.appConfigService.getDefaultRole();
    await this.authRepository.assignRolesToUser(id, [defaultRole], allRoles);
  }
}
