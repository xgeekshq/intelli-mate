import { sanitizeFilename } from '@/common/constants/files';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { Chroma } from 'langchain/vectorstores/chroma';

@Injectable()
export class VectorDbService {
  constructor(private readonly configService: ConfigService) {}

  getVectorDbClientForNewCollection(roomId: string, filename: string): Chroma {
    return new Chroma(new OpenAIEmbeddings(), {
      url: this.configService.get('CHROMADB_CONNECTION_URL'),
      collectionName: this.getCollectionName(roomId, filename),
    });
  }

  async getVectorDbClientForExistingCollection(
    roomId: string,
    filename: string
  ): Promise<Chroma> {
    return Chroma.fromExistingCollection(new OpenAIEmbeddings(), {
      url: this.configService.get('CHROMADB_CONNECTION_URL'),
      collectionName: this.getCollectionName(roomId, filename),
    });
  }

  private getCollectionName(roomId: string, filename: string) {
    return `${roomId}_${sanitizeFilename(filename)}`;
  }
}
