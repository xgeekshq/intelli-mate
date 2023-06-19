import { HttpException, HttpStatus } from '@nestjs/common';

export const OwnerMustBeLoggedExceptionSchema = {
  type: 'object',
  properties: {
    statusCode: {
      type: 'number',
      example: 400,
    },
    message: {
      type: 'array',
      items: {
        type: 'string',
        example: 'room: not_owner',
      },
    },
    error: {
      type: 'string',
      example: 'Owner must be logged in to create a room',
    },
  },
  required: ['statusCode', 'message', 'error'],
};

export class OwnerMustBeLoggedException extends HttpException {
  constructor() {
    super(
      {
        statusCode: HttpStatus.BAD_REQUEST,
        message: ['room: not_owner'],
        error: 'Owner must be logged in to create a room',
      },
      HttpStatus.BAD_REQUEST
    );
  }
}
