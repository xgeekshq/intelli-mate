import { AiModelSchema } from '@/ai/schemas/ai-model.mongoose.schema';
import { DATABASE_CONNECTION_KEY } from '@/common/constants/database';
import {
  DB_AI_MODELS_MODEL_KEY,
  DB_AI_MODELS_MODEL_NAME,
} from '@/common/constants/models/ai-model';
import { Connection } from 'mongoose';

export const aiModelsMongooseProviders = [
  {
    provide: DB_AI_MODELS_MODEL_KEY,
    useFactory: (connection: Connection) =>
      connection.model(DB_AI_MODELS_MODEL_NAME, AiModelSchema),
    inject: [DATABASE_CONNECTION_KEY],
  },
];
