import { DB_USER_ROLES_MODEL_KEY } from '@/common/constants/models/user-roles';
import { Role, UserRoles } from '@/common/types/user-roles';
import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

@Injectable()
export class AuthRepository {
  constructor(
    @Inject(DB_USER_ROLES_MODEL_KEY)
    private userRolesModel: Model<UserRoles>
  ) {}

  async findUserRolesForSingleUser(userId: string): Promise<UserRoles> {
    return this.userRolesModel.findOne({ userId });
  }

  async findUserRolesForMultiUsers(userIds?: string[]): Promise<UserRoles[]> {
    if (!userIds) return this.userRolesModel.find();
    return this.userRolesModel.find({ userId: { $in: userIds } });
  }

  async assignRolesToUser(
    userId: string,
    rolesToAssign: string[],
    allRoles: Role[]
  ): Promise<UserRoles> {
    const userRoles: UserRoles = await this.userRolesModel.findOne({ userId });
    const roles: Role[] = [];

    for (const roleToAssign of rolesToAssign) {
      roles.push(allRoles.find((role) => role.key === roleToAssign));
    }

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
