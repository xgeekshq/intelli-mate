import { ClerkAuthGuard } from '@/auth/guards/clerk/clerk.auth.guard';
import { Module } from '@nestjs/common';

@Module({
  providers: [ClerkAuthGuard],
  exports: [ClerkAuthGuard],
})
export class AuthModule {}
