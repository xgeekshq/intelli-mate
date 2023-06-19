import { HttpException, HttpStatus } from '@nestjs/common';

export const DuplicateRoomNameExceptionSchema = {
  type: 'object',
  properties: {
    statusCode: {
      type: 'number',
      example: 409,
    },
    message: {
      type: 'array',
      items: {
        type: 'string',
        example: 'name: duplicate',
      },
    },
    error: {
      type: 'string',
      example: 'Room name already exists',
    },
  },
  required: ['statusCode', 'message', 'error'],
};

export class DuplicateRoomNameException extends HttpException {
  constructor() {
    super(
      {
        statusCode: HttpStatus.CONFLICT,
        message: ['name: duplicate'],
        error: 'Room name already exists',
      },
      HttpStatus.CONFLICT
    );
  }
}
