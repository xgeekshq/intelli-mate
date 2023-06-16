import { applyDecorators } from '@nestjs/common';
import { ApiHeader } from '@nestjs/swagger';

export function ApiClerkAuthHeaders(): MethodDecorator {
  return applyDecorators(
    ApiHeader({ name: 'x-clerk-session-id', required: true }),
    ApiHeader({ name: 'x-clerk-jwt-token', required: true })
  );
}
