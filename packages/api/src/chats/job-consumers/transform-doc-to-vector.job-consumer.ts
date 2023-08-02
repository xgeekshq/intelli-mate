import { ChatsRepository } from '@/chats/chats.repository';
import {
  CSV_MIMETYPE,
  DOCX_MIMETYPE,
  PDF_MIMETYPE,
  TEXT_MIMETYPE,
  sanitizeFilename,
} from '@/common/constants/files';
import { CHAT_DOCUMENT_UPLOAD_QUEUE } from '@/common/constants/queues';
import { ChatDocUploadJob } from '@/common/jobs/chat-doc-upload.job';
import { ChatDocument } from '@/common/types/chat';
import { OnQueueError, OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { ConfigService } from '@nestjs/config';
import { Job } from 'bull';
import { Document } from 'langchain/document';
import { BaseDocumentLoader } from 'langchain/document_loaders';
import { CSVLoader } from 'langchain/document_loaders/fs/csv';
import { DocxLoader } from 'langchain/document_loaders/fs/docx';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { TextLoader } from 'langchain/document_loaders/fs/text';
import { OpenAIEmbeddings } from 'langchain/embeddings';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { Chroma } from 'langchain/vectorstores';

@Processor(CHAT_DOCUMENT_UPLOAD_QUEUE)
export class TransformDocToVectorJobConsumer {
  constructor(
    private readonly chatsRepository: ChatsRepository,
    private readonly configService: ConfigService
  ) {}

  @Process()
  async execute(job: Job<ChatDocUploadJob>) {
    const chatDocument = await this.fetchChatDocument(job.data);
    const lcDocuments = await this.loadLangchainDocuments(
      job.data.payload.roomId,
      chatDocument
    );
    void this.createDocumentVectorIndexes(chatDocument, lcDocuments);
  }

  @OnQueueError()
  async handleError(error: Error) {
    console.error(error);
  }

  @OnQueueFailed()
  async handleFailure(error: Error) {
    console.error(error);
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
      chunkSize: 1000,
      chunkOverlap: 200,
    });
    const documentBlob = new Blob([document.src]);

    if (document.meta.mimetype === PDF_MIMETYPE) {
      loader = new PDFLoader(documentBlob, { splitPages: true });
    }
    if (document.meta.mimetype === CSV_MIMETYPE) {
      loader = new CSVLoader(documentBlob);
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

    return lcDocuments;
  }

  private async createDocumentVectorIndexes(
    document: ChatDocument,
    lcDocuments: Document[]
  ) {
    const vectorStore = new Chroma(new OpenAIEmbeddings(), {
      url: this.configService.get('CHROMADB_CONNECTION_URL'),
      collectionName: sanitizeFilename(document.meta.filename),
    });

    await vectorStore.addDocuments(lcDocuments);
  }
}
