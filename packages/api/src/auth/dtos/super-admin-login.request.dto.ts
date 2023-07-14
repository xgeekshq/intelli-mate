import { SuperAdminLoginRequestSchema } from '@/contract/auth/super-admin-login.request.dto';
import { createZodDto } from '@anatine/zod-nestjs';

export class SuperAdminLoginRequestDto extends createZodDto(
  SuperAdminLoginRequestSchema
) {}
