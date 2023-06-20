import { HttpException, HttpStatus } from '@nestjs/common';

export const OwnerCannotLeaveRoomExceptionSchema = {
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
        example: 'room: owner',
      },
    },
    error: {
      type: 'string',
      example: 'Owner cannot leave room',
    },
  },
  required: ['statusCode', 'message', 'error'],
};

export class OwnerCannotLeaveRoomException extends HttpException {
  constructor() {
    super(
      {
        statusCode: HttpStatus.BAD_REQUEST,
        message: ['room: owner'],
        error: 'Owner cannot leave room',
      },
      HttpStatus.BAD_REQUEST
    );
  }
}
