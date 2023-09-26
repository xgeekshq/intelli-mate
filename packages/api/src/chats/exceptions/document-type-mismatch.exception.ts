import { HttpException, HttpStatus } from '@nestjs/common';

export const DocumentTypeMismatchExceptionSchema = {
  type: 'object',
  properties: {
    statusCode: {
      type: 'number',
      example: 406,
    },
    message: {
      type: 'array',
      items: {
        type: 'string',
        example: 'document: type_mismatch',
      },
    },
    error: {
      type: 'string',
      example: "Document type extension doesn't match its contents",
    },
  },
  required: ['statusCode', 'message', 'error'],
};

export class DocumentTypeMismatchException extends HttpException {
  constructor() {
    super(
      {
        statusCode: HttpStatus.NOT_ACCEPTABLE,
        message: ['document: type_mismatch'],
        error: "Document type extension doesn't match its contents",
      },
      HttpStatus.NOT_ACCEPTABLE
    );
  }
}
