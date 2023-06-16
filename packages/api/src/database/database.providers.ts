import { DATABASE_CONNECTION_KEY } from '@/common/constants/database';
import { ConfigService } from '@nestjs/config';
import * as mongoose from 'mongoose';

export const databaseProviders = [
  {
    provide: DATABASE_CONNECTION_KEY,
    useFactory: (configService: ConfigService): Promise<typeof mongoose> =>
      mongoose.connect(configService.get('MONGO_DB_CONNECTION_URL')),
    inject: [ConfigService],
  },
];
