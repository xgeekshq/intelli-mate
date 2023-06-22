import { DATABASE_CONNECTION_KEY } from '@/common/constants/database';
import {
  DB_CHAT_MODEL_KEY,
  DB_CHAT_MODEL_NAME,
} from '@/common/constants/models/chat';
import { Connection } from 'mongoose';

import { ChatSchema } from './schemas/chat.mongoose.schema';

export const chatsMongooseProviders = [
  {
    provide: DB_CHAT_MODEL_KEY,
    useFactory: (connection: Connection) =>
      connection.model(DB_CHAT_MODEL_NAME, ChatSchema),
    inject: [DATABASE_CONNECTION_KEY],
  },
];
