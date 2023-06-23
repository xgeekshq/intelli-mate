import { HttpException, HttpStatus } from '@nestjs/common';

export const ChatNotFoundExceptionSchema = {
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
        example: 'chat: not_found',
      },
    },
    error: {
      type: 'string',
      example: 'Chat does not exist',
    },
  },
  required: ['statusCode', 'message', 'error'],
};

export class ChatNotFoundException extends HttpException {
  constructor() {
    super(
      {
        statusCode: HttpStatus.NOT_FOUND,
        message: ['chat: not_found'],
        error: 'Chat does not exist',
      },
      HttpStatus.NOT_FOUND
    );
  }
}
