import { createCipheriv, createDecipheriv } from 'crypto';

export const encrypt = (text: string): string => {
  const secretKey = Buffer.from(process.env.SECRET, 'hex');
  const iv = Buffer.from(process.env.IV, 'hex');

  const cipher = createCipheriv('aes-256-cbc', Buffer.from(secretKey), iv);
  let encrypted = cipher.update(text, 'utf-8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
};

export const decrypt = (encryptedText: string): string => {
  const secretKey = Buffer.from(process.env.SECRET, 'hex');
  const iv = Buffer.from(process.env.IV, 'hex');

  const decipher = createDecipheriv('aes-256-cbc', Buffer.from(secretKey), iv);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf-8');
  decrypted += decipher.final('utf-8');
  return decrypted;
};
