import { createZodDto } from "@anatine/zod-nestjs";
import { extendApi } from "@anatine/zod-openapi";
import { z } from "zod";

export const CreateRoomRequestSchema = extendApi(
  z.object({
    name: z.string(),
    private: z.boolean().default(false),
    owner: z.string(),
  }),
  {
    title: "Create Room Request",
    description: "Create a new room",
  }
);

export class CreateRoomRequestDto extends createZodDto(
  CreateRoomRequestSchema
) {}
