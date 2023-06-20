import 'dotenv/config';
import { Provider } from '@/auth/providers/provider';
import { User } from '@/common/types/user';
import { users } from '@clerk/clerk-sdk-node';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ClerkAuthUserProvider implements Provider {
  async findUser(id: string): Promise<User | undefined> {
    const userList = await users.getUserList();
    return userList.find((u) => u.id === id);
  }

  findUsers(ids: string[]): Promise<User[]> {
    return users.getUserList({ userId: ids });
  }
}
