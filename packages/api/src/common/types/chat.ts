import { Document } from 'mongoose';

export interface AiMeta {
  llmModel: string;
  tokens: number;
  replyTo: string;
}

export interface Sender {
  userId: string;
  isAi: boolean;
  aiMeta?: AiMeta;
}

export interface Message {
  readonly id: string;
  sender: Sender;
  content: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface Chat extends Document {
  readonly id: string;
  roomId: string;
  messageHistory: Message[];
  participantIds: string[];
  readonly createdAt: string;
  readonly updatedAt: string;
}
