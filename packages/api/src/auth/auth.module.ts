import { ClerkAuthGuard } from '@/auth/guards/clerk/clerk.auth.guard';
import { ClerkAuthUserProvider } from '@/auth/providers/clerk/clerk-auth-user.provider';
import { Module } from '@nestjs/common';

@Module({
  providers: [ClerkAuthGuard, ClerkAuthUserProvider],
  exports: [ClerkAuthGuard, ClerkAuthUserProvider],
})
export class AuthModule {}
