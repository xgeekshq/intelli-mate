import { z } from "zod";

const ACCEPTED_FILE_SIZE_LIMIT = 10_000_000;
const PDF_MIMETYPE = "application/pdf";
const CSV_MIMETYPE = "text/csv";
const TEXT_MIMETYPE = "text/plain";
const DOCX_MIMETYPE =
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

const ACCEPTED_FILE_MIMETYPES = [
  PDF_MIMETYPE,
  CSV_MIMETYPE,
  TEXT_MIMETYPE,
  DOCX_MIMETYPE,
];
export const UploadDocumentsRequestSchema = z.object({
  fileRoles: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one role.",
  }),

  files: z
    .instanceof(FileList)
    .refine((files) => files.length > 0, "At least one file is required.")
    .refine((files) => files.length <= 2, "You can only upload 2 files.")
    .refine(
      (files) =>
        Array.from(files).reduce((size, file) => size + file.size, 0) <
        ACCEPTED_FILE_SIZE_LIMIT,
      "Total file size should be less than 10MB"
    )
    .refine(
      (files) =>
        Array.from(files).every((file) =>
          ACCEPTED_FILE_MIMETYPES.includes(file.type)
        ),
      "Invalid file type, please insert a file with one of the next types: pdf, csv, txt or a word document."
    ),
});
