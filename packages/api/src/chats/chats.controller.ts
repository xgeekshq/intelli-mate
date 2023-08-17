import { existsSync, mkdirSync } from 'fs';
import { ClerkAuthGuard } from '@/auth/guards/clerk/clerk.auth.guard';
import { ApiClerkAuthHeaders } from '@/auth/guards/clerk/open-api-clerk-headers.decorator';
import { ChatMessageResponseDto } from '@/chats/dtos/chat-message.response.dto';
import { ChatResponseDto } from '@/chats/dtos/chat.response.dto';
import { RemoveDocumentFromChatRequestDto } from '@/chats/dtos/remove-document-from-chat.request.dto';
import { ChatNotFoundExceptionSchema } from '@/chats/exceptions/chat-not-found.exception';
import { DocumentNotFoundExceptionSchema } from '@/chats/exceptions/document-not-found.exception';
import { DocumentPermissionsMismatchExceptionSchema } from '@/chats/exceptions/document-permissions-mismatch.exception';
import { MaxDocumentSizeLimitExceptionSchema } from '@/chats/exceptions/max-document-size-limit.exception';
import { NoMoreDocumentsCanBeUploadedToChatExceptionSchema } from '@/chats/exceptions/no-more-documents-can-be-uploaded-to-chat.exception';
import { FindChatByRoomIdUsecase } from '@/chats/usecases/find-chat-by-room-id.usecase';
import { FindChatMessageHistoryByRoomIdUsecase } from '@/chats/usecases/find-chat-message-history-by-room-id.usecase';
import { RemoveDocumentFromChatUsecase } from '@/chats/usecases/remove-document-from-chat.usecase';
import { UploadDocumentsToChatUsecase } from '@/chats/usecases/upload-documents-to-chat.usecase';
import {
  ACCEPTED_FILE_MIMETYPES_REGEXP,
  ACCEPTED_FILE_SIZE_LIMIT,
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
  Patch,
  Post,
  Request,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiConsumes,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { diskStorage } from 'multer';

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
    private readonly removeDocumentFromChatUsecase: RemoveDocumentFromChatUsecase,
    private readonly uploadDocumentsToChatUsecase: UploadDocumentsToChatUsecase,
    private readonly configService: ConfigService
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

  @Patch(':roomId/remove-document')
  @ApiClerkAuthHeaders()
  @ApiOkResponse({ type: ChatResponseDto })
  @ApiNotFoundResponse({ schema: DocumentNotFoundExceptionSchema })
  removeDocumentFromChat(
    @Request() req: Request,
    @Param('roomId') roomId: string,
    @Body() removeDocumentFromChatRequestDto: RemoveDocumentFromChatRequestDto
  ): Promise<ChatResponseDto> {
    return this.removeDocumentFromChatUsecase.execute(
      req.auth.userId,
      roomId,
      removeDocumentFromChatRequestDto
    );
  }

  @Post(':roomId/upload-documents')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseInterceptors(
    FilesInterceptor('files', 2, {
      storage: diskStorage({
        destination: (req, file, cb) => {
          existsSync('directory') || mkdirSync('directory');
          // @ts-ignore
          const uploadPath = `${this.configService.get(
            'CHAT_DOCUMENTS_FOLDER'
          )}/${req.params.roomId}`;
          if (!existsSync(uploadPath)) {
            mkdirSync(uploadPath, { recursive: true });
          }
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          cb(null, file.originalname);
        },
      }),
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
  @ApiBadRequestResponse({ schema: MaxDocumentSizeLimitExceptionSchema })
  @ApiConflictResponse({ schema: DocumentPermissionsMismatchExceptionSchema })
  @ApiForbiddenResponse({
    schema: NoMoreDocumentsCanBeUploadedToChatExceptionSchema,
  })
  @ApiNotFoundResponse({ schema: ChatNotFoundExceptionSchema })
  @ApiOperation({ description: 'Upload documents into a chat' })
  uploadDocumentsToChat(
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: ACCEPTED_FILE_SIZE_LIMIT,
            message: 'Files are limited to 16MB of size',
          }),
          new FileTypeValidator({
            fileType: ACCEPTED_FILE_MIMETYPES_REGEXP,
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
