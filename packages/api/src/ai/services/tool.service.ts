import { VectorDbService } from '@/ai/services/vector-db.service';
import { ChatDocument } from '@/common/types/chat';
import { Injectable } from '@nestjs/common';
import { VectorDBQAChain } from 'langchain/chains';
import { BaseChatModel } from 'langchain/chat_models';
import { ChainTool } from 'langchain/tools';

@Injectable()
export class ToolService {
  constructor(private readonly vectorDbService: VectorDbService) {}

  async getDocumentQATools(
    roomId: string,
    llmModel: BaseChatModel,
    documents: ChatDocument[]
  ): Promise<ChainTool[]> {
    const documentQATools = [];

    for (const document of documents) {
      const vectorStore =
        await this.vectorDbService.getVectorDbClientForExistingCollection(
          roomId,
          document.meta.filename
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
