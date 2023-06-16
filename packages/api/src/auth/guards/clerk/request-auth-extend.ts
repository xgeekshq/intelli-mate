import { Session } from '@clerk/clerk-sdk-node';

declare module '@nestjs/common' {
  interface Request {
    auth?: Session;
  }
}
