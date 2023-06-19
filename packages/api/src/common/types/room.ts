import { Document } from 'mongoose';

export interface Room extends Document {
  readonly id: string;
  name: string;
  private: boolean;
  owner: string;
  members: string[];
  createdAt: string;
  updatedAt: string;
}
