import { Document } from 'mongoose';

export interface Role {
  key: string;
  priority: number;
}

export interface UserRoles extends Document {
  userId: string;
  roles: Role[];
}
