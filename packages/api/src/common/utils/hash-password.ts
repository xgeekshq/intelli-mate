import { createHash } from 'crypto';

export function hashPassword(plainTextPassword: string): string {
  const hash = createHash('sha256');
  hash.update(plainTextPassword);
  return hash.digest('base64');
}
