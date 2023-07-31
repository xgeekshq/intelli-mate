import { Document } from 'mongoose';

export interface AiMeta {
  llmModel: string;
}

export interface ChatMessageMeta {
  tokens: number;
  replyTo?: string;
  ai?: AiMeta;
}

export interface Sender {
  userId?: string;
  isAi: boolean;
}

export interface ChatMessage {
  readonly id?: string;
  sender: Sender;
  content: string;
  meta: ChatMessageMeta;
  readonly createdAt: string;
}

export interface ChatDocumentMeta {
  mimetype: string;
  filename: string;
  size: number;
}

export interface ChatDocument {
  roles: string[];
  meta: ChatDocumentMeta;
  src?: Buffer;
}

export interface Chat extends Document {
  readonly id: string;
  roomId: string;
  messageHistory: ChatMessage[];
  participantIds: string[];
  documents: ChatDocument[];
  readonly createdAt: string;
  readonly updatedAt: string;
}
