import { HttpException, HttpStatus } from '@nestjs/common';

export const RoomMustBeEmptyToDeleteExceptionSchema = {
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
        example: 'room: not_empty',
      },
    },
    error: {
      type: 'string',
      example: 'The room must be empty so that it can be deleted',
    },
  },
  required: ['statusCode', 'message', 'error'],
};

export class RoomMustBeEmptyToDeleteException extends HttpException {
  constructor() {
    super(
      {
        statusCode: HttpStatus.BAD_REQUEST,
        message: ['room: not_empty'],
        error: 'The room must be empty so that it can be deleted',
      },
      HttpStatus.BAD_REQUEST
    );
  }
}
