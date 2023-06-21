import { HttpException, HttpStatus } from '@nestjs/common';

export const RoomIsPrivateExceptionSchema = {
  type: 'object',
  properties: {
    statusCode: {
      type: 'number',
      example: 403,
    },
    message: {
      type: 'array',
      items: {
        type: 'string',
        example: 'room: private',
      },
    },
    error: {
      type: 'string',
      example: 'Cannot join a private room',
    },
  },
  required: ['statusCode', 'message', 'error'],
};

export class RoomIsPrivateException extends HttpException {
  constructor() {
    super(
      {
        statusCode: HttpStatus.FORBIDDEN,
        message: ['room: private'],
        error: 'Cannot join a private room',
      },
      HttpStatus.FORBIDDEN
    );
  }
}
