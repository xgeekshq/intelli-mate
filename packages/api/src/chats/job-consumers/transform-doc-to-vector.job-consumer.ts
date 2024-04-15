import { readFileSync } from 'fs';
import { AiService } from '@/ai/facades/ai.service';
import { ChatsRepository } from '@/chats/chats.repository';
import {
  DOCX_MIMETYPE,
  PDF_MIMETYPE,
  TEXT_MIMETYPE,
} from '@/common/constants/files';
import { CHAT_DOCUMENT_UPLOAD_QUEUE } from '@/common/constants/queues';
import {
  DocumentProcessingFinishedEventKey,
  createDocumentProcessingFinishedEventFactory,
} from '@/common/events/document-processing-finished.event';
import { ChatDocUploadJob } from '@/common/jobs/chat-doc-upload.job';
import { ChatDocument } from '@/common/types/chat';
import { OnQueueError, OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Job } from 'bull';
import { BaseDocumentLoader } from 'langchain/dist/document_loaders/base';
import { Document } from 'langchain/document';
import { DocxLoader } from 'langchain/document_loaders/fs/docx';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { TextLoader } from 'langchain/document_loaders/fs/text';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';

@Processor(CHAT_DOCUMENT_UPLOAD_QUEUE)
export class TransformDocToVectorJobConsumer {
  private readonly logger = new Logger(TransformDocToVectorJobConsumer.name);

  constructor(
    private readonly chatsRepository: ChatsRepository,
    private readonly aiService: AiService,
    private readonly eventEmitter: EventEmitter2
  ) {}

  @Process()
  async execute(job: Job<ChatDocUploadJob>) {
    this.logger.log(
      `Starting job consumer for ${CHAT_DOCUMENT_UPLOAD_QUEUE} queue for job ${job.id} with payload: `,
      {
        payload: job.data.payload,
      }
    );

    const chatDocument = await this.fetchChatDocument(job.data);
    const lcDocuments = await this.loadLangchainDocuments(
      job.data.payload.roomId,
      chatDocument
    );
    await this.createDocumentVectorIndexes(
      job.data.payload.roomId,
      job.data.payload.aiModelId,
      chatDocument,
      lcDocuments
    );

    this.logger.log(
      `Finished job consumer for ${CHAT_DOCUMENT_UPLOAD_QUEUE} queue for job ${job.id}`
    );
  }

  @OnQueueError()
  async handleError(error: Error) {
    this.logger.error(
      `Error executing job consumer for ${CHAT_DOCUMENT_UPLOAD_QUEUE} queue. Error message: `,
      { error }
    );
  }

  @OnQueueFailed()
  async handleFailure(error: Error) {
    this.logger.error(
      `Failed to execute job consumer for ${CHAT_DOCUMENT_UPLOAD_QUEUE} queue. Error message: `,
      { error }
    );
  }

  private async fetchChatDocument(
    jobData: ChatDocUploadJob
  ): Promise<ChatDocument> {
    return this.chatsRepository.findChatDocumentByRoomId(
      jobData.payload.roomId,
      jobData.payload.filename
    );
  }

  private async loadLangchainDocuments(
    roomId: string,
    document: ChatDocument
  ): Promise<Document[]> {
    let loader: BaseDocumentLoader;
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000, // default is 1000
      chunkOverlap: 200, // default is 200
    });
    let chatDocumentContent: Buffer;
    try {
      chatDocumentContent = readFileSync(
        `${document.src}/${document.meta.filename}`
      );
    } catch (error) {
      this.logger.error(
        `Error reading file ${document.meta.filename}. Error message: `,
        { error }
      );
    }
    const documentBlob = new Blob([chatDocumentContent]);

    if (document.meta.mimetype === PDF_MIMETYPE) {
      loader = new PDFLoader(documentBlob);
    }
    if (document.meta.mimetype === TEXT_MIMETYPE) {
      loader = new TextLoader(documentBlob);
    }
    if (document.meta.mimetype === DOCX_MIMETYPE) {
      loader = new DocxLoader(documentBlob);
    }

    const lcDocuments = await loader.loadAndSplit(textSplitter);
    lcDocuments.forEach((doc) => {
      const existingMeta = doc.metadata || {};

      doc.metadata = {
        ...existingMeta,
        roomId,
        filename: document.meta.filename,
        roles: document.roles,
      };
    });

    this.logger.debug(`Loaded file and split into langchain documents: `);

    return lcDocuments;
  }

  private async createDocumentVectorIndexes(
    roomId: string,
    chatLlmId: string,
    document: ChatDocument,
    lcDocuments: Document[]
  ) {
    await this.aiService.addDocumentsToVectorDBCollection(
      roomId,
      document.meta.filename,
      lcDocuments
    );

    this.logger.debug(`Documents added to vector store: `, {
      roomId,
      filename: document.meta.filename,
    });

    const vectorDBDocumentMetadata =
      await this.aiService.askAiToDescribeDocument(lcDocuments, chatLlmId);

    this.logger.debug(`File summary fetched: `, {
      title: vectorDBDocumentMetadata.name,
      description: vectorDBDocumentMetadata.description,
    });

    await this.chatsRepository.addVectorDBMetadataToDocument(
      roomId,
      document,
      vectorDBDocumentMetadata
    );

    this.logger.debug(`Added document metadata to database`, {
      roomId,
      document: {
        roles: document.roles,
        meta: document.meta,
      },
      vectorDBDocumentMetadata,
    });

    this.eventEmitter.emit(
      DocumentProcessingFinishedEventKey,
      createDocumentProcessingFinishedEventFactory(
        roomId,
        document.meta.filename
      )
    );
  }
}
