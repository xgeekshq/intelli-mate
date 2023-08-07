import { HttpException, HttpStatus } from '@nestjs/common';

export const RedisChatMemoryNotFoundExceptionSchema = {
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
        example: 'redis_chat: not_found',
      },
    },
    error: {
      type: 'string',
      example: 'Redis chat memory does not exist',
    },
  },
  required: ['statusCode', 'message', 'error'],
};

export class RedisChatMemoryNotFoundException extends HttpException {
  constructor() {
    super(
      {
        statusCode: HttpStatus.NOT_FOUND,
        message: ['redis_chat: not_found'],
        error: 'Redis chat does not exist',
      },
      HttpStatus.NOT_FOUND
    );
  }
}
