import 'dotenv/config';
import { UserNotSuperAdminException } from '@/auth/exceptions/user-not-super-admin.exception';
import { AuthGuard } from '@/auth/guards/auth-guard';
import { AdminValidateCredentialsUsecase } from '@/auth/usecases/admin-validate-credentials.usecase';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class SuperAdminAuthGuard extends AuthGuard {
  constructor(
    private readonly adminValidateCredentialsUsecase: AdminValidateCredentialsUsecase
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const superAdminEmail = request.get('x-super-admin-email');
    const superAdminPassword = request.get('x-super-admin-password');

    return new Promise<boolean>((resolve, reject) => {
      this.adminValidateCredentialsUsecase
        .execute({
          email: superAdminEmail,
          password: superAdminPassword,
        })
        .then(() => resolve(true))
        .catch(() => reject(new UserNotSuperAdminException()));
    });
  }
}
