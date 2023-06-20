import { UpdateRoomSettingsRequestSchema } from '@/contract/rooms/update-room-settings.request.dto';
import { createZodDto } from '@anatine/zod-nestjs';

export class UpdateRoomSettingsRequestDto extends createZodDto(
  UpdateRoomSettingsRequestSchema
) {}
