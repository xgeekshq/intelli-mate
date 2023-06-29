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
    private readonly addMessageToChatUsecase: AddMessageToChatUsecase
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
    this.server
      .to(data.roomId)
      .emit(
        'message',
        createSocketMessageResponseFactory(
          data.id,
          data.content,
          false,
          data.userId
        )
      );

    const addedMessage = await this.addMessageToChatUsecase.execute(
      data.roomId,
      AddMessageToChatRequestSchema.parse({
        sender: { isAi: false },
        content: data.content,
        meta: {
          tokens: 14,
        },
      }),
      data.userId
    );

    const aiResponse = 'Response to You';

    setTimeout(
      () =>
        this.server
          .to(data.roomId)
          .emit(
            'message',
            createSocketMessageResponseFactory(data.id, aiResponse, true)
          ),
      2000
    );

    await this.addMessageToChatUsecase.execute(
      data.roomId,
      AddMessageToChatRequestSchema.parse({
        sender: { isAi: true },
        content: aiResponse,
        meta: {
          tokens: 14,
          replyTo: addedMessage.id,
          ai: {
            llmModel: 'chat-gpt',
          },
        },
      })
    );
  }
}
