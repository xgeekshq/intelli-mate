import { HttpException, HttpStatus } from '@nestjs/common';

export const UserNotRoomMemberExceptionSchema = {
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
        example: 'room: not_member',
      },
    },
    error: {
      type: 'string',
      example: 'This user is not a member of this room',
    },
  },
  required: ['statusCode', 'message', 'error'],
};

export class UserNotRoomMemberException extends HttpException {
  constructor() {
    super(
      {
        statusCode: HttpStatus.BAD_REQUEST,
        message: ['room: room: not_member'],
        error: 'This user is not a member of this room',
      },
      HttpStatus.BAD_REQUEST
    );
  }
}
