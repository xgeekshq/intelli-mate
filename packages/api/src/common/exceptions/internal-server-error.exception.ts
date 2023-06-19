import { HttpException, HttpStatus } from '@nestjs/common';

export class InternalServerErrorException extends HttpException {
  constructor(message: string) {
    super(
      {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: [],
        error: message,
      },
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
}
