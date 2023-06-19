import { HttpException, HttpStatus } from '@nestjs/common';

export const UserNotFoundExceptionSchema = {
  type: 'object',
  properties: {
    statusCode: {
      type: 'number',
      example: 404,
    },
    message: {
      type: 'array',
      items: {
        type: 'string',
        example: 'user: not_found',
      },
    },
    error: {
      type: 'string',
      example: 'User does not exist',
    },
  },
  required: ['statusCode', 'message', 'error'],
};

export class UserNotFoundException extends HttpException {
  constructor() {
    super(
      {
        statusCode: HttpStatus.NOT_FOUND,
        message: ['user: not_found'],
        error: 'User does not exist',
      },
      HttpStatus.NOT_FOUND
    );
  }
}
