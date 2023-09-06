import { IntelliMateJob } from '@/common/jobs/intelli-mate.job';

export interface ChatDocUploadJob extends IntelliMateJob {
  payload: {
    roomId: string;
    aiModelId: string;
    filename: string;
  };
}

export function createChatDocUploadJobFactory(
  roomId: string,
  aiModelId: string,
  filename: string
): ChatDocUploadJob {
  return {
    createdAt: new Date().toISOString(),
    payload: {
      roomId,
      aiModelId,
      filename,
    },
  };
}
