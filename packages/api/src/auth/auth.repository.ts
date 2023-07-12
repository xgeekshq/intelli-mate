import { DB_USER_ROLES_MODEL_KEY } from '@/common/constants/models/user-roles';
import { UserRoles } from '@/common/types/user-roles';
import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

@Injectable()
export class AuthRepository {
  constructor(
    @Inject(DB_USER_ROLES_MODEL_KEY)
    private userRolesModel: Model<UserRoles>
  ) {}

  async assignRolesToUser(userId: string, roles: string[]): Promise<UserRoles> {
    const userRoles: UserRoles = await this.userRolesModel.findOne({ userId });
    if (userRoles) {
      userRoles.roles = roles;
      await userRoles.save();
      return userRoles;
    }
    const newUserRoles = new this.userRolesModel({
      userId,
      roles,
    });
    await newUserRoles.save();
    return newUserRoles;
  }
}
