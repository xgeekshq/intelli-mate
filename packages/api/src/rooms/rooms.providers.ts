import { DATABASE_CONNECTION_KEY } from '@/types/constants/database';
import {
  DB_ROOM_MODEL_KEY,
  DB_ROOM_MODEL_NAME,
} from '@/types/constants/models/room';
import { Connection } from 'mongoose';

import { RoomSchema } from './schemas/room.mongoose.schema';

export const roomsProviders = [
  {
    provide: DB_ROOM_MODEL_KEY,
    useFactory: (connection: Connection) =>
      connection.model(DB_ROOM_MODEL_NAME, RoomSchema),
    inject: [DATABASE_CONNECTION_KEY],
  },
];
