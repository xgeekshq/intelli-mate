import { AppConfigModule } from '@/app-config/app-config.module';
import { AuthAdminController } from '@/auth/admin.controller';
import { AuthController } from '@/auth/auth.controller';
import { authMongooseProviders } from '@/auth/auth.mongoose.providers';
import { AuthRepository } from '@/auth/auth.repository';
import { ClerkAuthGuard } from '@/auth/guards/clerk/clerk.auth.guard';
import { ClerkAuthUserProvider } from '@/auth/providers/clerk/clerk-auth-user.provider';
import { AdminUpdateUserRolesUsecase } from '@/auth/usecases/admin-update-user-roles.usecase';
import { AdminValidateCredentialsUsecase } from '@/auth/usecases/admin-validate-credentials.usecase';
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
    // Usecases
    AdminValidateCredentialsUsecase,
    AdminUpdateUserRolesUsecase,
    // Services
    AuthRepository,
  ],
  exports: [ClerkAuthGuard, ClerkAuthUserProvider],
  controllers: [AuthController, AuthAdminController],
})
export class AuthModule {}
