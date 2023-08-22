import { IntelliMateEvent } from '@/common/events/intelli-mate.event';

export const DocumentProcessingFinishedEventKey = 'chat.document.ready';

export interface DocumentProcessingFinishedEvent extends IntelliMateEvent {
  payload: {
    roomId: string;
    filename: string;
  };
}

export function createDocumentProcessingFinishedEventFactory(
  roomId: string,
  filename: string
): DocumentProcessingFinishedEvent {
  return {
    createdAt: new Date().toISOString(),
    payload: {
      roomId,
      filename,
    },
  };
}
