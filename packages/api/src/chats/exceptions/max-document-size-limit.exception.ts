import { HttpException, HttpStatus } from '@nestjs/common';

export const MaxDocumentSizeLimitExceptionSchema = {
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
        example: 'document: size',
      },
    },
    error: {
      type: 'string',
      example: 'The documents in the room cannot surpass 16MB in size',
    },
  },
  required: ['statusCode', 'message', 'error'],
};

export class MaxDocumentSizeLimitException extends HttpException {
  constructor() {
    super(
      {
        statusCode: HttpStatus.BAD_REQUEST,
        message: ['document: size'],
        error: 'The documents in the room cannot surpass 16MB in size',
      },
      HttpStatus.BAD_REQUEST
    );
  }
}
