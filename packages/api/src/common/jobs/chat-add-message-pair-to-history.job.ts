import { IntelliMateJob } from '@/common/jobs/intelli-mate.job';
import { AddMessageToChatRequestSchema } from '@/contract/chats/add-message-to-chat.request.dto';
import { z } from 'zod';

export interface ChatAddMessagePairToHistoryJob extends IntelliMateJob {
  payload: {
    roomId: string;
    question: z.infer<typeof AddMessageToChatRequestSchema>;
    answer: z.infer<typeof AddMessageToChatRequestSchema>;
    userId?: string;
  };
}

export function createChatAddMessagePairToHistoryJobFactory(
  roomId: string,
  question: z.infer<typeof AddMessageToChatRequestSchema>,
  answer: z.infer<typeof AddMessageToChatRequestSchema>,
  userId?: string
): ChatAddMessagePairToHistoryJob {
  return {
    createdAt: new Date().toISOString(),
    payload: {
      roomId,
      question,
      answer,
      userId,
    },
  };
}
