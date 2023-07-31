import { ClerkAuthGuard } from '@/auth/guards/clerk/clerk.auth.guard';
import { ApiClerkAuthHeaders } from '@/auth/guards/clerk/open-api-clerk-headers.decorator';
import { ChatMessageResponseDto } from '@/chats/dtos/chat-message.response.dto';
import { ChatResponseDto } from '@/chats/dtos/chat.response.dto';
import { ChatNotFoundExceptionSchema } from '@/chats/exceptions/chat-not-found.exception';
import { DocumentPermissionsMismatchExceptionSchema } from '@/chats/exceptions/document-permissions-mismatch.exception';
import { FindChatByRoomIdUsecase } from '@/chats/usecases/find-chat-by-room-id.usecase';
import { FindChatMessageHistoryByRoomIdUsecase } from '@/chats/usecases/find-chat-message-history-by-room-id.usecase';
import { UploadDocumentsToChatUsecase } from '@/chats/usecases/upload-documents-to-chat.usecase';
import {
  acceptedFileMimetypesRegExp,
  acceptedFileSizeLimit,
} from '@/common/constants/files';
import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  HttpCode,
  HttpStatus,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Request,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { memoryStorage } from 'multer';

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
    private readonly uploadDocumentsToChatUsecase: UploadDocumentsToChatUsecase
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

  @Post(':roomId/upload-documents')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseInterceptors(
    FilesInterceptor('files', 2, {
      storage: memoryStorage(),
    })
  )
  @ApiClerkAuthHeaders()
  @ApiBody({
    required: true,
    schema: {
      type: 'object',
      properties: {
        fileRoles: {
          type: 'array',
          items: {
            type: 'string',
          },
        },
        files: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiConsumes('multipart/form-data')
  @ApiNoContentResponse({ description: 'No content' })
  @ApiBadRequestResponse({ schema: DocumentPermissionsMismatchExceptionSchema })
  @ApiNotFoundResponse({ schema: ChatNotFoundExceptionSchema })
  @ApiOperation({ description: 'Upload documents into a chat' })
  uploadDocumentsToChat(
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: acceptedFileSizeLimit,
            message: 'Files are limited to 16MB of size',
          }),
          new FileTypeValidator({
            fileType: acceptedFileMimetypesRegExp,
          }),
        ],
      })
    )
    files: Express.Multer.File[],
    @Param('roomId') roomId: string,
    @Body('fileRoles') fileRoles: string
  ): Promise<void> {
    return this.uploadDocumentsToChatUsecase.execute(
      roomId,
      files,
      fileRoles.split(',')
    );
  }
}
