import { CACHE_CLIENT } from '@/common/constants/cache';
import { ConfigService } from '@nestjs/config';
import { createClient } from 'redis';

export const cacheProviders = [
  {
    provide: CACHE_CLIENT,
    useFactory: async (configService: ConfigService) => {
      const client = createClient({
        url: `redis://${configService.get('REDIS_CONNECTION_URL')}`,
        password: configService.get('REDIS_HOST_PASSWORD'),
      });
      await client.connect();
      return client;
    },
    inject: [ConfigService],
  },
];
