import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { Request, Response } from 'express';

import { AuthGuard } from './guard';

@Injectable()
export class ClerkAuthGuard extends AuthGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const response: Response = context.switchToHttp().getResponse();
    return new Promise<boolean>((resolve, reject) => {
      ClerkExpressRequireAuth()(request, response, (err?: any) => {
        if (err) {
          reject(err);
        }
        resolve(true);
      });
    });
  }
}
