import { UserRolesSchema } from '@/auth/schemas/user-roles.mongoose.schema';
import { DATABASE_CONNECTION_KEY } from '@/common/constants/database';
import {
  DB_USER_ROLES_MODEL_KEY,
  DB_USER_ROLES_MODEL_NAME,
} from '@/common/constants/models/user-roles';
import { Connection } from 'mongoose';

export const authMongooseProviders = [
  {
    provide: DB_USER_ROLES_MODEL_KEY,
    useFactory: (connection: Connection) =>
      connection.model(DB_USER_ROLES_MODEL_NAME, UserRolesSchema),
    inject: [DATABASE_CONNECTION_KEY],
  },
];
