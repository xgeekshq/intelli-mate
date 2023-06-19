import { HttpException, HttpStatus } from '@nestjs/common';

export const RoomNotFoundExceptionSchema = {
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
        example: 'room: not_found',
      },
    },
    error: {
      type: 'string',
      example: 'Room does not exist',
    },
  },
  required: ['statusCode', 'message', 'error'],
};

export class RoomNotFoundException extends HttpException {
  constructor() {
    super(
      {
        statusCode: HttpStatus.NOT_FOUND,
        message: ['room: not_found'],
        error: 'Room does not exist',
      },
      HttpStatus.NOT_FOUND
    );
  }
}
