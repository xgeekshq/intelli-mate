export const acceptedFileSizeLimit = 16_000_000; // 16MB in bytes -> limit of blob in mongo for collections. If more than this is needed, then use GridFS

export const acceptedFileMimetypesRegExp =
  /^(application\/pdf|text\/csv|text\/plain)$/;

export const acceptedFileMimetypes = [
  'application/pdf',
  'text/csv',
  'text/plain',
];
