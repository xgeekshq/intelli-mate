import 'dotenv/config';
import { UserUnauthorizedException } from '@/auth/exceptions/user-unauthorized.exception';
import { AuthGuard } from '@/auth/guards/auth-guard';
import { clerkClient } from '@clerk/clerk-sdk-node';
import { ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class ClerkAuthGuard extends AuthGuard {
  private readonly logger = new Logger(ClerkAuthGuard.name);

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const clerkJwtToken = request.get('x-clerk-jwt-token');

    return new Promise<boolean>((resolve, reject) => {
      clerkClient
        .authenticateRequest({
          loadSession: true,
          headerToken: clerkJwtToken,
        })
        .then((session) => {
          request['auth'] = session.toAuth().session;
          resolve(true);
        })
        .catch((e) => {
          this.logger.error('Failed to authenticate user. Error message: ', {
            error: e,
            stack: e.stack,
          });
          reject(new UserUnauthorizedException());
        });
    });
  }
}
