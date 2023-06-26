import { Document } from 'mongoose';

export interface AiMeta {
  llmModel: string;
}

export interface Meta {
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
  meta: Meta;
  readonly createdAt: string;
}

export interface Chat extends Document {
  readonly id: string;
  roomId: string;
  messageHistory: ChatMessage[];
  participantIds: string[];
  readonly createdAt: string;
  readonly updatedAt: string;
}
