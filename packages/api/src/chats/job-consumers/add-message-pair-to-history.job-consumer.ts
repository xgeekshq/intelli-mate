import { AddMessageToChatUsecase } from '@/chats/usecases/add-message-to-chat.usecase';
import { CHAT_MESSAGE_HISTORY_QUEUE } from '@/common/constants/queues';
import { ChatAddMessagePairToHistoryJob } from '@/common/jobs/chat-add-message-pair-to-history.job';
import { OnQueueError, OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';

@Processor(CHAT_MESSAGE_HISTORY_QUEUE)
export class AddMessagePairToHistoryJobConsumer {
  private readonly logger = new Logger(AddMessagePairToHistoryJobConsumer.name);

  constructor(
    private readonly addMessageToChatUsecase: AddMessageToChatUsecase
  ) {}

  @Process()
  async execute(job: Job<ChatAddMessagePairToHistoryJob>) {
    this.logger.log(
      `Starting job consumer for ${CHAT_MESSAGE_HISTORY_QUEUE} queue for job ${job.id} with payload: `,
      {
        payload: job.data.payload,
      }
    );

    const { roomId, question, answer, userId } = job.data.payload;

    const savedQuestion = await this.addMessageToChatUsecase.execute(
      roomId,
      question,
      userId
    );

    this.logger.debug(`Question saved in chat history: `, {
      question,
    });

    answer.meta.replyTo = savedQuestion.id;

    await this.addMessageToChatUsecase.execute(roomId, answer);

    this.logger.debug(`Answer saved in chat history: `, {
      answer,
    });

    this.logger.log(
      `Finished job consumer for ${CHAT_MESSAGE_HISTORY_QUEUE} queue for job ${job.id}`
    );
  }

  @OnQueueError()
  async handleError(error: Error) {
    this.logger.error(
      `Error executing job consumer for ${CHAT_MESSAGE_HISTORY_QUEUE} queue. Error message: `,
      { error }
    );
  }

  @OnQueueFailed()
  async handleFailure(error: Error) {
    this.logger.error(
      `Failed to execute job consumer for ${CHAT_MESSAGE_HISTORY_QUEUE} queue. Error message: `,
      { error }
    );
  }
}
