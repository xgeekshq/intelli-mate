import { Document } from 'mongoose';

export interface UserRoles extends Document {
  userId: string;
  roles: string[];
}
