import { CACHE_CLIENT } from '@/common/constants/cache';
import { Inject, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { RedisClientType } from 'redis';

@Injectable()
export class RedisKeepAliveService {
  constructor(
    @Inject(CACHE_CLIENT)
    private readonly cacheClient: RedisClientType
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handleCron() {
    await this.cacheClient.ping();
  }
}
