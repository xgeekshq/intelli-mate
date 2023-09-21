import { Document } from 'mongoose';

export interface AiMeta {
  llmModel: string;
}

export interface SourceMeta {
  filename: string;
  snippets: string[];
}

export interface ChatMessageMeta {
  tokens: number;
  replyTo?: string;
  ai?: AiMeta;
  source?: SourceMeta;
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
  queryable: boolean;
  vectorDBDocumentName: string | null;
  vectorDBDocumentDescription: string | null;
}

export interface ChatDocument {
  roles: string[];
  meta: ChatDocumentMeta;
  src?: string;
}

export interface Chat extends Document {
  readonly id: string;
  roomId: string;
  aiModelId: string;
  messageHistory: ChatMessage[];
  participantIds: string[];
  documents: ChatDocument[];
  readonly createdAt: string;
  readonly updatedAt: string;
}
