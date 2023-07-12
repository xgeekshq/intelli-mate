import { HttpException, HttpStatus } from '@nestjs/common';

export class AppConfigNotFoundException extends HttpException {
  constructor() {
    super(
      {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: ['appConfig: not_found'],
        error: 'Application configuration missing',
      },
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
}
