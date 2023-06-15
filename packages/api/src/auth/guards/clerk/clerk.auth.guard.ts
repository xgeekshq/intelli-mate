import 'dotenv/config';
import { AuthGuard } from '@/auth/guards/guard';
import { sessions } from '@clerk/clerk-sdk-node';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class ClerkAuthGuard extends AuthGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const clerkJwtToken = request.get('x-clerk-jwt-token');
    const clerkSessionId = request.get('x-clerk-session-id');

    return new Promise<boolean>((resolve, reject) => {
      sessions
        .verifySession(clerkSessionId, clerkJwtToken)
        .then((session) => {
          request['auth'] = session;
          resolve(true);
        })
        .catch((err) => {
          console.error(err);
          reject('User is not authenticated');
        });
    });
  }
}
