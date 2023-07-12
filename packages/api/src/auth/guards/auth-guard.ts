import { CanActivate, ExecutionContext } from '@nestjs/common';

export abstract class AuthGuard implements CanActivate {
  abstract canActivate(context: ExecutionContext): Promise<boolean>;
}
