import { HttpException, HttpStatus } from '@nestjs/common';

export const NoMoreDocumentsCanBeUploadedToChatExceptionSchema = {
  type: 'object',
  properties: {
    statusCode: {
      type: 'number',
      example: 403,
    },
    message: {
      type: 'array',
      items: {
        type: 'string',
        example: 'document: limit',
      },
    },
    error: {
      type: 'string',
      example: 'This chat cannot contain any more documents',
    },
  },
  required: ['statusCode', 'message', 'error'],
};

export class NoMoreDocumentsCanBeUploadedToChatException extends HttpException {
  constructor() {
    super(
      {
        statusCode: HttpStatus.FORBIDDEN,
        message: ['document: limit'],
        error: 'This chat cannot contain any more documents',
      },
      HttpStatus.FORBIDDEN
    );
  }
}
