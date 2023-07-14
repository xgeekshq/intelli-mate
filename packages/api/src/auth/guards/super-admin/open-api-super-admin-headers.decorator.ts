import { applyDecorators } from '@nestjs/common';
import { ApiHeader } from '@nestjs/swagger';

export function ApiSuperAdminAuthHeaders(): MethodDecorator {
  return applyDecorators(
    ApiHeader({ name: 'x-super-admin-email', required: true }),
    ApiHeader({ name: 'x-super-admin-password', required: true })
  );
}
