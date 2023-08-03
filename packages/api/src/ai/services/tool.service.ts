import { sanitizeFilename } from '@/common/constants/files';
import { ChatDocument } from '@/common/types/chat';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { VectorDBQAChain } from 'langchain/chains';
import { BaseChatModel } from 'langchain/chat_models';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { ChainTool } from 'langchain/tools';
import { Chroma } from 'langchain/vectorstores/chroma';

@Injectable()
export class ToolService {
  constructor(private readonly configService: ConfigService) {}

  async getDocumentQATools(
    llmModel: BaseChatModel,
    documents: ChatDocument[]
  ): Promise<ChainTool[]> {
    const documentQATools = [];

    for (const document of documents) {
      const vectorStore = await Chroma.fromExistingCollection(
        new OpenAIEmbeddings(),
        {
          url: this.configService.get('CHROMADB_CONNECTION_URL'),
          collectionName: sanitizeFilename(document.meta.filename),
        }
      );

      const chain = VectorDBQAChain.fromLLM(llmModel, vectorStore);

      const qaTool = new ChainTool({
        name: document.meta.vectorDBDocumentName,
        description: document.meta.vectorDBDocumentDescription,
        chain,
      });

      documentQATools.push(qaTool);
    }

    return documentQATools;
  }
}
