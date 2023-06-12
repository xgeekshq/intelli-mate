import { createZodDto } from "@anatine/zod-nestjs";
import { extendApi } from "@anatine/zod-openapi";
import { z } from "zod";

export const CreateRoomResponseSchema = extendApi(
  z.object({
    name: z.string(),
    private: z.boolean().default(false),
    owner: z.string(),
  }),
  {
    title: "Create Room Response",
  }
);

export class CreateRoomResponseDto extends createZodDto(
  CreateRoomResponseSchema
) {}
