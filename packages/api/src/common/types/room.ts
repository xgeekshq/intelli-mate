import { Document } from 'mongoose';

export interface Room extends Document {
  readonly id: string;
  name: string;
  isPrivate: boolean;
  ownerId: string;
  members: string[];
  readonly createdAt: string;
  readonly updatedAt: string;
}
