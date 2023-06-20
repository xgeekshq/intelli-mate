import { User } from '@/common/types/user';

export interface Provider {
  findUser(id: string): Promise<User | undefined>;
  findUsers(ids: string[]): Promise<User[]>;
}
