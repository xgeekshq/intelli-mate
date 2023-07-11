import { DATABASE_CONNECTION_KEY } from '@/common/constants/database';
import { ConfigService } from '@nestjs/config';
import * as mongoose from 'mongoose';

export const databaseProviders = [
  {
    provide: DATABASE_CONNECTION_KEY,
    useFactory: (configService: ConfigService): Promise<typeof mongoose> => {
      const connection = configService.get('MONGO_DB_CONNECTION_URL');
      const dbName = configService.get('MONGO_DB_NAME');
      const lastIndex = connection.lastIndexOf('/');
      const url = `${connection.substring(
        0,
        lastIndex + 1
      )}${dbName}${connection.substring(lastIndex + 1)}`;

      return mongoose.connect(url);
    },
    inject: [ConfigService],
  },
];
