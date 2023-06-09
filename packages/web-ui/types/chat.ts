export interface ChatMessageType {
  id: string;
  content: string;
  response?: string;
  user?: ChatUserType;
  createdAt: string;
}

export interface ChatUserType {
  userId: string;
  imageUrl: string;
  userName: string | null;
  name: string | null;
  email: string;
}
