import { HttpException, HttpStatus } from '@nestjs/common';

export const NoRoomSettingsDefinedExceptionSchema = {
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
        example: 'room: no_changes',
      },
    },
    error: {
      type: 'string',
      example: 'No settings were changed',
    },
  },
  required: ['statusCode', 'message', 'error'],
};

export class NoRoomSettingsDefinedException extends HttpException {
  constructor() {
    super(
      {
        statusCode: HttpStatus.BAD_REQUEST,
        message: ['room: no_changes'],
        error: 'No settings were changed',
      },
      HttpStatus.BAD_REQUEST
    );
  }
}
