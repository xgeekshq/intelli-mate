import { AiModule } from '@/ai/ai.module';
import { AppConfigModule } from '@/app-config/app-config.module';
import { AuthModule } from '@/auth/auth.module';
import { CacheModule } from '@/cache/cache.module';
import { ChatsModule } from '@/chats/chats.module';
import { DatabaseModule } from '@/database/database.module';
import { RoomsModule } from '@/rooms/rooms.module';
import { ZodValidationPipe } from '@anatine/zod-nestjs';
import { BullModule, BullRootModuleOptions } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    EventEmitterModule.forRoot(),
    BullModule.forRootAsync({
      useFactory: (configService: ConfigService): BullRootModuleOptions => ({
        redis: {
          host: `${configService.get('REDIS_CONNECTION_URL')}`,
          password: configService.get('REDIS_HOST_PASSWORD'),
        },
      }),
      inject: [ConfigService],
    }),
    CacheModule,
    DatabaseModule,
    AuthModule,
    RoomsModule,
    ChatsModule,
    AiModule,
    AppConfigModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
  ],
})
export class AppModule {}
