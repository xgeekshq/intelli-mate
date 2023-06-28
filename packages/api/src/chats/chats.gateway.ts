import { AddMessageToChatUsecase } from '@/chats/usecases/add-message-to-chat.usecase';
import { CreateChatForRoomUsecase } from '@/chats/usecases/create-chat-for-room.usecase';
import { SocketMessageRequestDto } from '@/contract/chats/socket-message.request.dto';
import { SocketMessageResponseDto } from '@/contract/chats/socket-message.response.dto';
import { SocketRoomCreateRequestDto } from '@/contract/chats/socket-room-create.request.dto';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

const createSocketMessageResponseFactory = (
  id: string,
  response: string,
  isAi: boolean,
  userId?: string
): SocketMessageResponseDto => {
  return {
    id,
    response,
    isAi,
    userId,
  };
};

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatsGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly createChatForRoomUsecase: CreateChatForRoomUsecase,
    private readonly addMessageToChatUsecase: AddMessageToChatUsecase
  ) {}

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @MessageBody('data') data: SocketRoomCreateRequestDto,
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
  async handleConnectedToRoom(
    @MessageBody('data') data: SocketMessageRequestDto
  ) {
    console.log(data);
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
    const chatMessage = {
      sender: { isAi: false },
      content: data.content,
      meta: {
        tokens: 14,
      },
    };
    const addedMessage = await this.addMessageToChatUsecase.execute(
      data.roomId,
      chatMessage,
      data.userId
    );

    const aiResponse = {
      sender: { isAi: true },
      content: 'Response to You',
      meta: {
        tokens: 14,
        replyTo: addedMessage.id,
        ai: {
          llmModel: 'chat-gpt',
        },
      },
    };

    setTimeout(
      () =>
        this.server
          .to(data.roomId)
          .emit(
            'message',
            createSocketMessageResponseFactory(
              data.id,
              aiResponse.content,
              true
            )
          ),
      2000
    );

    await this.addMessageToChatUsecase.execute(data.roomId, aiResponse);
  }
}
