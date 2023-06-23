import { ClerkAuthGuard } from '@/auth/guards/clerk/clerk.auth.guard';
import { ApiClerkAuthHeaders } from '@/auth/guards/clerk/open-api-clerk-headers.decorator';
import { ChatMessageResponseDto } from '@/chats/dtos/chat-message.response.dto';
import { ChatResponseDto } from '@/chats/dtos/chat.response.dto';
import { ChatNotFoundExceptionSchema } from '@/chats/exceptions/chat-not-found.exception';
import { CreateChatForRoomUsecase } from '@/chats/usecases/create-chat-for-room.usecase';
import { FindChatByRoomIdUsecase } from '@/chats/usecases/find-chat-by-room-id.usecase';
import { FindChatMessageHistoryByRoomIdUsecase } from '@/chats/usecases/find-chat-message-history-by-room-id.usecase';
import { Controller, Get, Param, Request, UseGuards } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@Controller({
  path: 'chats',
  version: '1',
})
@ApiTags('chats')
@UseGuards(ClerkAuthGuard)
export class ChatsController {
  constructor(
    private readonly findChatByRoomIdUsecase: FindChatByRoomIdUsecase,
    private readonly findChatMessageHistoryByRoomIdUsecase: FindChatMessageHistoryByRoomIdUsecase,
    private readonly createChatForRoomUsecase: CreateChatForRoomUsecase
  ) {}

  @Get(':roomId')
  @ApiClerkAuthHeaders()
  @ApiOkResponse({ type: ChatResponseDto })
  @ApiNotFoundResponse({ schema: ChatNotFoundExceptionSchema })
  @ApiOperation({ description: 'Get a single chat by room id' })
  findChatByRoomId(
    @Request() req: Request,
    @Param('roomId') roomId: string
  ): Promise<ChatResponseDto> {
    return this.findChatByRoomIdUsecase.execute(req.auth.userId, roomId);
  }

  @Get('history/:roomId')
  @ApiClerkAuthHeaders()
  @ApiOkResponse({ type: ChatMessageResponseDto, isArray: true })
  @ApiNotFoundResponse({ schema: ChatNotFoundExceptionSchema })
  @ApiOperation({ description: 'Get the message history for a chat' })
  findChatHistoryByRoomId(
    @Request() req: Request,
    @Param('roomId') roomId: string
  ): Promise<ChatMessageResponseDto[]> {
    return this.findChatMessageHistoryByRoomIdUsecase.execute(
      req.auth.userId,
      roomId
    );
  }
}
