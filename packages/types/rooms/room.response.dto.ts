import { createZodDto } from "@anatine/zod-nestjs";
import { z } from "zod";

export const CreateRoomResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  private: z.boolean().default(false),
  owner: z.string(),
  members: z.array(z.string()),
});

export class CreateRoomResponseDto extends createZodDto(
  CreateRoomResponseSchema
) {}
