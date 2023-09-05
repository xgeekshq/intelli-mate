import { AiService } from '@/ai/facades/ai.service';
import { AppConfigService } from '@/app-config/app-config.service';
import { ChatsRepository } from '@/chats/chats.repository';
import { createSocketMessageResponseFactory } from '@/chats/factory/create-socket-message.factory';
import { JoinChatUsecase } from '@/chats/usecases/join-chat.usecase';
import { CHAT_MESSAGE_HISTORY_QUEUE } from '@/common/constants/queues';
import {
  DocumentProcessingFinishedEvent,
  DocumentProcessingFinishedEventKey,
} from '@/common/events/document-processing-finished.event';
import { createChatAddMessagePairToHistoryJobFactory } from '@/common/jobs/chat-add-message-pair-to-history.job';
import { ChatDocument } from '@/common/types/chat';
import { AddMessageToChatRequestSchema } from '@/contract/chats/add-message-to-chat.request.dto';
import { SocketCreateRoomRequestDto } from '@/contract/chats/socket-create-room.request.dto';
import { SocketMessageRequestDto } from '@/contract/chats/socket-message.request.dto';
import { InjectQueue } from '@nestjs/bull';
import { OnEvent } from '@nestjs/event-emitter';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Queue } from 'bull';
import { encode } from 'gpt-3-encoder';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class ChatSocketGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly joinChatUsecase: JoinChatUsecase,
    private readonly chatsRepository: ChatsRepository,
    private readonly aiService: AiService,
    private readonly appConfigService: AppConfigService,
    @InjectQueue(CHAT_MESSAGE_HISTORY_QUEUE)
    private readonly chatMessageHistoryQueue: Queue
  ) {}

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @MessageBody('data') data: SocketCreateRoomRequestDto,
    @ConnectedSocket() client: Socket
  ) {
    const chat = await this.joinChatUsecase.execute(data.userId, data);
    client.join(chat.roomId);
    return chat.roomId;
  }

  @SubscribeMessage('leaveRoom')
  async handleLeaveRoom(
    @MessageBody('data') data: { roomId: string },
    @ConnectedSocket() client: Socket
  ) {
    client.leave(data.roomId);
  }

  @SubscribeMessage('message')
  async handleMessageToRoom(
    @MessageBody('data') data: SocketMessageRequestDto
  ) {
    this.server.to(data.roomId).emit(
      'message',
      createSocketMessageResponseFactory({
        id: data.id,
        response: data.content,
        isAi: false,
        createdAt: new Date().toISOString(),
        userId: data.userId,
      })
    );

    const aiResponse = await this.aiService.askAiInFreeText(
      data.content,
      data.roomId,
      '64f5f5732d06129c8cf80f4f',
      await this.shouldSummarizeChat(data.roomId),
      await this.fetchDocumentsForContext(data.roomId)
    );

    this.server.to(data.roomId).emit(
      'message',
      createSocketMessageResponseFactory({
        id: data.id,
        response: aiResponse,
        isAi: true,
        createdAt: new Date().toISOString(),
      })
    );

    await this.chatMessageHistoryQueue.add(
      createChatAddMessagePairToHistoryJobFactory(
        data.roomId,
        AddMessageToChatRequestSchema.parse({
          sender: { isAi: false },
          content: data.content,
          meta: {
            tokens: encode(data.content).length,
          },
        }),
        AddMessageToChatRequestSchema.parse({
          sender: { isAi: true },
          content: aiResponse,
          meta: {
            tokens: encode(aiResponse).length,
            ai: {
              llmModel: this.appConfigService.getAiAppConfig().defaultAiModel,
            },
          },
        }),
        data.userId
      )
    );
  }

  @OnEvent(DocumentProcessingFinishedEventKey, { async: true })
  async handleEvent(event: DocumentProcessingFinishedEvent): Promise<void> {
    this.server
      .to(event.payload.roomId)
      .emit('documentReady', { filename: event.payload.filename });
  }

  private async shouldSummarizeChat(roomId: string): Promise<boolean> {
    const chatMessageHistory = await this.aiService.getChatHistoryMessages(
      roomId
    );

    const numberOfTokensRedis = chatMessageHistory.reduce((acc, curr) => {
      if (!curr.content) {
        return 0;
      }
      return (acc += encode(curr.content).length);
    }, 0);

    return (
      numberOfTokensRedis >
      this.appConfigService.getAiAppConfig().defaultTokenLimitForSummarization
    );
  }

  // TODO: all documents from the chat are being passed in BUT permission check with members should be done.
  //    Documents should only be passed in if they are queryable, meaning that they have been processed and stored in a vector db
  private async fetchDocumentsForContext(
    roomId: string
  ): Promise<ChatDocument[]> {
    const chat = await this.chatsRepository.findChatByRoomId(roomId);
    const allDocumentsReadyToQuery = chat.documents.every(
      (document) => document.meta.queryable
    );

    return allDocumentsReadyToQuery ? chat.documents : [];
  }
}
