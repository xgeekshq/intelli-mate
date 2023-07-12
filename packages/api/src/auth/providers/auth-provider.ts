import { User } from '@/common/types/user';

export interface AuthProvider {
  findUser(id: string): Promise<User | undefined>;
  findUsers(ids: string[]): Promise<User[]>;
  assignRolesToUser(id: string, roles: string[]): Promise<void>;
  assignDefaultRoleToUser(id: string): Promise<void>;
}
