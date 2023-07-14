import { HttpException, HttpStatus } from '@nestjs/common';

export const UserNotSuperAdminExceptionSchema = {
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
        example: 'user: not_super_admin',
      },
    },
    error: {
      type: 'string',
      example: 'User is not a super admin',
    },
  },
  required: ['statusCode', 'message', 'error'],
};

export class UserNotSuperAdminException extends HttpException {
  constructor() {
    super(
      {
        statusCode: HttpStatus.FORBIDDEN,
        message: ['user: not_super_admin'],
        error: 'User is not a super admin',
      },
      HttpStatus.FORBIDDEN
    );
  }
}
