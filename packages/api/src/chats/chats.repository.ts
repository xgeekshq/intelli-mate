import { AddMessageToChatRequestDto } from '@/chats/dtos/add-message-to-chat.request.dto';
import { CreateChatForRoomRequestDto } from '@/chats/dtos/create-chat-for-room.request.dto';
import { RemoveDocumentFromChatRequestDto } from '@/chats/dtos/remove-document-from-chat.request.dto';
import { DB_CHAT_MODEL_KEY } from '@/common/constants/models/chat';
import { createChatMessageFactory } from '@/common/factories/create-chat-message.factory';
import { Chat, ChatDocument, ChatMessage } from '@/common/types/chat';
import { chatDocumentsFolder } from '@/utils/global';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';

@Injectable()
export class ChatsRepository {
  constructor(
    @Inject(DB_CHAT_MODEL_KEY)
    private chatModel: Model<Chat>,
    private readonly configService: ConfigService
  ) {}

  async findChatByRoomId(roomId: string): Promise<Chat> {
    return this.chatModel.findOne({ roomId });
  }

  async findChatDocumentByRoomId(
    roomId: string,
    filename: string
  ): Promise<ChatDocument> {
    const chat = await this.chatModel
      .findOne({ roomId })
      .select('+documents.src');

    return chat.documents.find(
      (document) => document.meta.filename === filename
    );
  }

  async createChatForRoom(
    userId: string,
    createChatForRoomRequestDto: CreateChatForRoomRequestDto
  ): Promise<Chat> {
    const chat = new this.chatModel({
      roomId: createChatForRoomRequestDto.roomId,
      participantIds: [userId],
      messageHistory: [],
    });

    await chat.save();
    return chat;
  }

  async addParticipantToChat(chat: Chat, userId: string): Promise<Chat> {
    if (!chat.participantIds.find((id) => userId === id)) {
      chat.participantIds.push(userId);
      await chat.save();
    }
    return chat;
  }

  async addMessageToChat(
    chat: Chat,
    addMessageToChatRequestDto: AddMessageToChatRequestDto,
    userId?: string
  ): Promise<ChatMessage> {
    chat.messageHistory.push(
      createChatMessageFactory(addMessageToChatRequestDto, userId)
    );
    if (
      !addMessageToChatRequestDto.sender.isAi &&
      !chat.participantIds.find((id) => userId === id)
    ) {
      chat.participantIds.push(userId);
    }
    await chat.save();
    return chat.messageHistory.sort(this.messageDateSortAscPredicate).at(0);
  }

  async removeDocumentFromChat(
    chat: Chat,
    removeDocumentFromChatRequestDto: RemoveDocumentFromChatRequestDto
  ): Promise<Chat> {
    chat.documents = chat.documents.filter(
      (document) =>
        document.meta.filename !== removeDocumentFromChatRequestDto.filename
    );

    await chat.save();
    return chat;
  }

  async addDocumentsToChat(
    chat: Chat,
    documents: Express.Multer.File[],
    documentRoles: string[]
  ): Promise<Chat> {
    chat.documents.push(
      ...documents.map((multerDoc) => ({
        roles: documentRoles,
        meta: {
          mimetype: multerDoc.mimetype,
          filename: multerDoc.originalname,
          size: multerDoc.size,
          queryable: false,
          vectorDBDocumentName: null,
          vectorDBDocumentDescription: null,
        },
        src: `${chatDocumentsFolder}/${chat.roomId}`,
      }))
    );

    await chat.save();
    return chat;
  }

  async addVectorDBMetadataToDocument(
    roomId: string,
    document: ChatDocument,
    vectorDBDocumentMetadata: { name: string; description: string }
  ): Promise<void> {
    await this.chatModel.findOneAndUpdate(
      { roomId, 'documents.meta.filename': document.meta.filename },
      {
        $set: {
          'documents.$.meta.queryable': true,
          'documents.$.meta.vectorDBDocumentName':
            vectorDBDocumentMetadata.name,
          'documents.$.meta.vectorDBDocumentDescription':
            vectorDBDocumentMetadata.description,
        },
      }
    );
  }

  private messageDateSortAscPredicate(a: ChatMessage, b: ChatMessage) {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  }
}
