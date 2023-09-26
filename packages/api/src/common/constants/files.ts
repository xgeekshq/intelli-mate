import * as process from 'process';

export const ACCEPTED_FILE_SIZE_LIMIT = 16_000_000;

export const ACCEPTED_FILE_MIMETYPES_REGEXP =
  /^(application\/pdf|text\/plain|application\/vnd\.openxmlformats-officedocument\.wordprocessingml\.document)$/;

export const PDF_MIMETYPE = 'application/pdf';
export const TEXT_MIMETYPE = 'text/plain';
export const DOCX_MIMETYPE =
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

export const acceptedFileMimetypes = [
  PDF_MIMETYPE,
  TEXT_MIMETYPE,
  DOCX_MIMETYPE,
];

export const PDF_BUFFER_SIGNATURE = '25504446'; // 4 relevant bytes
export const TXT_UTF8_BUFFER_SIGNATURE = 'EFBBBF'; // 3 relevant bytes
export const TXT_BUFFER_SIGNATURE = '546869'; // 3 relevant bytes
export const DOCX_BUFFER_SIGNATURE = '504b0304'; // 4 relevant bytes

export const acceptedFileBufferSignatures = [
  PDF_BUFFER_SIGNATURE,
  TXT_UTF8_BUFFER_SIGNATURE,
  TXT_BUFFER_SIGNATURE,
  DOCX_BUFFER_SIGNATURE,
];

export const fileBufferSignatureByMimetypeMap: {
  [key: string]: { relevantBytes: number; signature: string | string[] };
} = {
  [PDF_MIMETYPE]: {
    relevantBytes: 4,
    signature: [PDF_BUFFER_SIGNATURE],
  },
  [TEXT_MIMETYPE]: {
    relevantBytes: 3,
    signature: [TXT_UTF8_BUFFER_SIGNATURE, TXT_BUFFER_SIGNATURE],
  },
  [DOCX_MIMETYPE]: {
    relevantBytes: 4,
    signature: [DOCX_BUFFER_SIGNATURE],
  },
};

export function sanitizeFilename(filename: string): string {
  const roomIdLength = 24;
  const maxCollectionNameLength = 62;

  let sanitizedFilename = filename
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]/g, '-')
    .replace(/_+/g, '-')
    .replace(/-+/g, '-')
    .toLowerCase();

  if (filename.length + roomIdLength >= maxCollectionNameLength) {
    sanitizedFilename = sanitizedFilename.substring(
      0,
      maxCollectionNameLength - roomIdLength
    );
  }

  return sanitizedFilename;
}

export const chatDocumentsFolder = () => process.env.CHAT_DOCUMENTS_FOLDER;
