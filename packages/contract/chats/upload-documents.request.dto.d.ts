import { UploadDocumentsRequestSchema } from "./upload-documents.request.dto";
import { z } from "zod";

export type UploadDocumentsRequestDto = z.infer<
  typeof UploadDocumentsRequestSchema
>;
