import { SuperAdminValidateCredentialsRequestSchema } from '@/contract/auth/super-admin-validate-credentials.request.dto';
import { createZodDto } from '@anatine/zod-nestjs';

export class SuperAdminValidateCredentialsRequestDto extends createZodDto(
  SuperAdminValidateCredentialsRequestSchema
) {}
