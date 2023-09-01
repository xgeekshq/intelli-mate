import { Document } from 'mongoose';

export interface AiModels extends Document {
  chatModelName: string;
  modelName: string;
  apiKey: string;
}
