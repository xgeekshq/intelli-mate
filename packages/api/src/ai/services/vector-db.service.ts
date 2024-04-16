import { sanitizeFilename } from '@/common/constants/files';
import { Chroma } from '@langchain/community/vectorstores/chroma';
import { OpenAIEmbeddings } from '@langchain/openai';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

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
