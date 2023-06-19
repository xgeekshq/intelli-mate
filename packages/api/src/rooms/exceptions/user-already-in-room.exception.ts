import { HttpException, HttpStatus } from '@nestjs/common';

export const UserAlreadyInRoomExceptionSchema = {
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
        example: 'room: already_member',
      },
    },
    error: {
      type: 'string',
      example: 'This user is already a member of this room',
    },
  },
  required: ['statusCode', 'message', 'error'],
};

export class UserAlreadyInRoomException extends HttpException {
  constructor() {
    super(
      {
        statusCode: HttpStatus.BAD_REQUEST,
        message: ['room: already_member'],
        error: 'This user is already a member of this room',
      },
      HttpStatus.BAD_REQUEST
    );
  }
}
