import { HttpException, HttpStatus } from '@nestjs/common';

export const DuplicateChatLlmNameExceptionSchema = {
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
        example: 'chatLlmName: duplicate',
      },
    },
    error: {
      type: 'string',
      example: 'Chat LLM already exists',
    },
  },
  required: ['statusCode', 'message', 'error'],
};

export class DuplicateChatLlmNameException extends HttpException {
  constructor() {
    super(
      {
        statusCode: HttpStatus.CONFLICT,
        message: ['chatLlmName: duplicate'],
        error: 'Chat LLM already exists',
      },
      HttpStatus.CONFLICT
    );
  }
}
