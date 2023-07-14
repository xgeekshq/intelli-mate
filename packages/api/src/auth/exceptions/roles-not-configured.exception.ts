import { HttpException, HttpStatus } from '@nestjs/common';

export const RolesNotConfiguredExceptionSchema = {
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
        example: 'role: not_configured',
      },
    },
    error: {
      type: 'string',
      example: "Roles don't match with configured roles",
    },
  },
  required: ['statusCode', 'message', 'error'],
};

export class RolesNotConfiguredException extends HttpException {
  constructor() {
    super(
      {
        statusCode: HttpStatus.BAD_REQUEST,
        message: ['role: not_configured'],
        error: "Roles don't match with configured roles",
      },
      HttpStatus.BAD_REQUEST
    );
  }
}
