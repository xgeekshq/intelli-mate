export interface ChatMessageType {
  id: string;
  content: string;
  response?: string;
  user?: ChatUserType;
  source?: ChatMessageSourceType;
  createdAt: string;
}

export interface ChatUserType {
  userId: string;
  imageUrl: string;
  userName: string | null;
  name: string | null;
  email: string;
}

export interface SocketMessageType {
  roomId: string;
  aiModelId: string;
  content: string;
  userId: string;
}

export interface ChatMessageSourceType {
  filename: string;
  snippets: string[];
}
