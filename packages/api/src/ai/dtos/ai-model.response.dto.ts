import { AiModelResponseSchema } from '@/contract/ai/ai-model.response.dto';
import { createZodDto } from '@anatine/zod-nestjs';

export class AiModelResponseDto extends createZodDto(AiModelResponseSchema) {}
