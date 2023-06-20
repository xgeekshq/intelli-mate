import { HttpException, HttpStatus } from '@nestjs/common';

export const NotRoomOwnerExceptionSchema = {
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
        example: 'room: not_owner',
      },
    },
    error: {
      type: 'string',
      example: 'Only a room owner can edit its settings',
    },
  },
  required: ['statusCode', 'message', 'error'],
};

export class NotRoomOwnerException extends HttpException {
  constructor() {
    super(
      {
        statusCode: HttpStatus.FORBIDDEN,
        message: ['room: not_owner'],
        error: 'Only a room owner can edit its settings',
      },
      HttpStatus.FORBIDDEN
    );
  }
}
