export interface ChatMessageType {
  id: string;
  content: string;
  response?: string;
  user?: ChatUserType;
}

export interface ChatUserType {
  userId: string;
  imageUrl: string;
  userName: string | null;
}
