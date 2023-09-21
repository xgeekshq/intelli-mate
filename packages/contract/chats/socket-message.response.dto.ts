export interface SocketMessageResponseDto {
  id: string;
  response: string;
  isAi: boolean;
  userId?: string;
  source?: { filename: string; snippets: string[] };
  createdAt: string;
}
