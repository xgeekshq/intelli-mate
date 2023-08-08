import { HttpException, HttpStatus } from '@nestjs/common';

export const DocumentNotFoundExceptionSchema = {
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
        example: 'document: not_found',
      },
    },
    error: {
      type: 'string',
      example: 'Document does not exist',
    },
  },
  required: ['statusCode', 'message', 'error'],
};

export class DocumentNotFoundException extends HttpException {
  constructor() {
    super(
      {
        statusCode: HttpStatus.NOT_FOUND,
        message: ['document: not_found'],
        error: 'Document does not exist',
      },
      HttpStatus.NOT_FOUND
    );
  }
}
