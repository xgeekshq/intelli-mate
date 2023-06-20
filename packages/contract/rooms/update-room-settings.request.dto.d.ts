import { UpdateRoomSettingsRequestSchema } from "./update-room-settings.request.dto";
import { z } from "zod";

export type UpdateRoomSettingsRequestDto = z.infer<
  typeof UpdateRoomSettingsRequestSchema
>;
