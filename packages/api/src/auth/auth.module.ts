import { AppConfigModule } from '@/app-config/app-config.module';
import { AuthController } from '@/auth/auth.controller';
import { authMongooseProviders } from '@/auth/auth.mongoose.providers';
import { AuthRepository } from '@/auth/auth.repository';
import { ClerkAuthGuard } from '@/auth/guards/clerk/clerk.auth.guard';
import { ClerkAuthUserProvider } from '@/auth/providers/clerk/clerk-auth-user.provider';
import { DatabaseModule } from '@/database/database.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [DatabaseModule, AppConfigModule],
  providers: [
    // DB Providers
    ...authMongooseProviders,
    // Guards
    ClerkAuthGuard,
    // AuthProviders
    ClerkAuthUserProvider,
    // Services
    AuthRepository,
  ],
  exports: [ClerkAuthGuard, ClerkAuthUserProvider],
  controllers: [AuthController],
})
export class AuthModule {}
