import { Document } from 'mongoose';

export interface AiModel extends Document {
  chatLlmName: string;
  modelName: string;
  temperature: number;
  description: string;
  meta: Record<string, string>;
}
