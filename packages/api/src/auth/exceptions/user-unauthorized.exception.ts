import { HttpException, HttpStatus } from '@nestjs/common';

export class UserUnauthorizedException extends HttpException {
  constructor() {
    super(
      {
        statusCode: HttpStatus.UNAUTHORIZED,
        message: ['user: unauthorized'],
        error: 'User is not authenticated',
      },
      HttpStatus.UNAUTHORIZED
    );
  }
}
