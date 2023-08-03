import { HttpException, HttpStatus } from '@nestjs/common';

export const DocumentPermissionsMismatchExceptionSchema = {
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
        example: 'document: permissions',
      },
    },
    error: {
      type: 'string',
      example: "Document roles don't match the chat participant roles",
    },
  },
  required: ['statusCode', 'message', 'error'],
};

export class DocumentPermissionsMismatchException extends HttpException {
  constructor() {
    super(
      {
        statusCode: HttpStatus.CONFLICT,
        message: ['document: permissions'],
        error: "Document roles don't match the chat participant roles",
      },
      HttpStatus.CONFLICT
    );
  }
}
