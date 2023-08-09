import { AddMessageToChatUsecase } from '@/chats/usecases/add-message-to-chat.usecase';
import { CHAT_MESSAGE_HISTORY_QUEUE } from '@/common/constants/queues';
import { ChatAddMessagePairToHistoryJob } from '@/common/jobs/chat-add-message-pair-to-history.job';
import { OnQueueError, OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';

@Processor(CHAT_MESSAGE_HISTORY_QUEUE)
export class AddMessagePairToHistoryJobConsumer {
  constructor(
    private readonly addMessageToChatUsecase: AddMessageToChatUsecase
  ) {}

  @Process()
  async execute(job: Job<ChatAddMessagePairToHistoryJob>) {
    const { roomId, question, answer, userId } = job.data.payload;

    const savedQuestion = await this.addMessageToChatUsecase.execute(
      roomId,
      question,
      userId
    );

    answer.meta.replyTo = savedQuestion.id;

    await this.addMessageToChatUsecase.execute(roomId, answer);
  }

  @OnQueueError()
  async handleError(error: Error) {
    console.error(error);
  }

  @OnQueueFailed()
  async handleFailure(error: Error) {
    console.error(error);
  }
}
