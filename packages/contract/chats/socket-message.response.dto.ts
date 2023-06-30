export interface SocketMessageResponseDto {
  id: string;
  response: string;
  isAi: boolean;
  userId?: string;
  createdAt: string;
}
