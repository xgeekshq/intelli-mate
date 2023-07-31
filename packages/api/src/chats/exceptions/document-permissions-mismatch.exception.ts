import { HttpException, HttpStatus } from '@nestjs/common';

export const DocumentPermissionsMismatchExceptionSchema = {
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
        statusCode: HttpStatus.BAD_REQUEST,
        message: ['document: permissions'],
        error: "Document roles don't match the chat participant roles",
      },
      HttpStatus.BAD_REQUEST
    );
  }
}
