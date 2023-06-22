import { AuthModule } from '@/auth/auth.module';
import { ChatsModule } from '@/chats/chats.module';
import { DatabaseModule } from '@/database/database.module';
import { RoomsModule } from '@/rooms/rooms.module';
import { ZodValidationPipe } from '@anatine/zod-nestjs';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    RoomsModule,
    DatabaseModule,
    AuthModule,
    ChatsModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
  ],
})
export class AppModule {}
