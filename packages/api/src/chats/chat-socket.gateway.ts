import { AiService } from '@/ai/services/ai.service';
import { createSocketMessageResponseFactory } from '@/chats/factory/create-socket-message.factory';
import { AddMessageToChatUsecase } from '@/chats/usecases/add-message-to-chat.usecase';
import { CreateChatForRoomUsecase } from '@/chats/usecases/create-chat-for-room.usecase';
import { AddMessageToChatRequestSchema } from '@/contract/chats/add-message-to-chat.request.dto';
import { SocketCreateRoomRequestDto } from '@/contract/chats/socket-create-room.request.dto';
import { SocketMessageRequestDto } from '@/contract/chats/socket-message.request.dto';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { encode } from 'gpt-3-encoder';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatSocketGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly createChatForRoomUsecase: CreateChatForRoomUsecase,
    private readonly addMessageToChatUsecase: AddMessageToChatUsecase,
    private readonly aiService: AiService
  ) {}

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @MessageBody('data') data: SocketCreateRoomRequestDto,
    @ConnectedSocket() client: Socket
  ) {
    const chat = await this.createChatForRoomUsecase.execute(data.userId, data);
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

    const { message: addedMessage, shouldSummarize } =
      await this.addMessageToChatUsecase.execute(
        data.roomId,
        AddMessageToChatRequestSchema.parse({
          sender: { isAi: false },
          content: data.content,
          meta: {
            tokens: encode(data.content).length,
          },
        }),
        data.userId
      );

    const { response: aiResponse } = await this.aiService.askAiInFreeText(
      data.content,
      data.roomId,
      shouldSummarize
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

    await this.addMessageToChatUsecase.execute(
      data.roomId,
      AddMessageToChatRequestSchema.parse({
        sender: { isAi: true },
        content: aiResponse,
        meta: {
          tokens: encode(aiResponse).length,
          replyTo: addedMessage.id,
          ai: {
            llmModel: 'gpt-3.5-turbo',
          },
        },
      })
    );
  }
}
