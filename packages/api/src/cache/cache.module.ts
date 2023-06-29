import { Module } from '@nestjs/common';

import { cacheProviders } from './cache.providers';

@Module({
  providers: [...cacheProviders],
  exports: [...cacheProviders],
})
export class CacheModule {}
