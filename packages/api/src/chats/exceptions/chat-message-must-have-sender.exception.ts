import { HttpException, HttpStatus } from '@nestjs/common';

export const ChatMessageMustHaveSenderExceptionSchema = {
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
        example: 'chat_message: no_sender',
      },
    },
    error: {
      type: 'string',
      example: 'Message must have a sender id',
    },
  },
  required: ['statusCode', 'message', 'error'],
};

export class ChatMessageMustHaveSenderException extends HttpException {
  constructor() {
    super(
      {
        statusCode: HttpStatus.BAD_REQUEST,
        message: ['chat_message: no_sender'],
        error: 'Message must have a sender id',
      },
      HttpStatus.BAD_REQUEST
    );
  }
}
