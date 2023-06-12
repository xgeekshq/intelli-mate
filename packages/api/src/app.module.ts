import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { DatabaseModule } from './database/database.module';
import { RoomsModule } from './rooms/rooms.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    RoomsModule,
    DatabaseModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
