import { SuperAdminAiModelResponseSchema } from '@/contract/ai/super-admin-ai-model.response.dto';
import { createZodDto } from '@anatine/zod-nestjs';

export class SuperAdminAiModelResponseDto extends createZodDto(
  SuperAdminAiModelResponseSchema
) {}
