import { UploadFilesRequestSchema } from "./upload-files.request.dto";
import { z } from "zod";

export type UploadFilesRequestDto = z.infer<typeof UploadFilesRequestSchema>;
