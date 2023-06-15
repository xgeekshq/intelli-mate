import { DATABASE_CONNECTION_KEY } from '@/common/constants/database';
import {
  DB_ROOM_MODEL_KEY,
  DB_ROOM_MODEL_NAME,
} from '@/common/constants/models/room';
import { Connection } from 'mongoose';

import { RoomSchema } from './schemas/room.mongoose.schema';

export const roomsMongooseProviders = [
  {
    provide: DB_ROOM_MODEL_KEY,
    useFactory: (connection: Connection) =>
      connection.model(DB_ROOM_MODEL_NAME, RoomSchema),
    inject: [DATABASE_CONNECTION_KEY],
  },
];
