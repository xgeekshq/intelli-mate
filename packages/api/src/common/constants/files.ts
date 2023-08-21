import * as process from 'process';

export const ACCEPTED_FILE_SIZE_LIMIT = 16_000_000;

export const ACCEPTED_FILE_MIMETYPES_REGEXP =
  /^(application\/pdf|text\/csv|text\/plain|application\/vnd\.openxmlformats-officedocument\.wordprocessingml\.document)$/;

export const PDF_MIMETYPE = 'application/pdf';
export const CSV_MIMETYPE = 'text/csv';
export const TEXT_MIMETYPE = 'text/plain';
export const DOCX_MIMETYPE =
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

export const acceptedFileMimetypes = [
  PDF_MIMETYPE,
  CSV_MIMETYPE,
  TEXT_MIMETYPE,
  DOCX_MIMETYPE,
];

export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]/g, '-')
    .replace(/_+/g, '-')
    .replace(/-+/g, '-')
    .toLowerCase();
}

export const chatDocumentsFolder = process.env.CHAT_DOCUMENTS_FOLDER;
