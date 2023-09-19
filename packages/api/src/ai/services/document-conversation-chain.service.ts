import { MemoryService } from '@/ai/services/memory.service';
import { SimpleConversationChainService } from '@/ai/services/simple-conversation-chain.service';
import { VectorDbService } from '@/ai/services/vector-db.service';
import { ChatDocument } from '@/common/types/chat';
import { Injectable } from '@nestjs/common';
import { RetrievalQAChain, loadQAStuffChain } from 'langchain/chains';
import { BaseChatModel } from 'langchain/chat_models';
import { PromptTemplate } from 'langchain/prompts';

type DocumentConversationChainServiceProps = {
  llmModel: BaseChatModel;
  documents: ChatDocument[];
  roomId: string;
  summary?: string;
};
@Injectable()
export class DocumentConversationChainService {
  defaultChatPrompt: string;

  constructor(
    private readonly memoryService: MemoryService,
    private readonly vectorDbService: VectorDbService,
    private readonly simpleConversationChainService: SimpleConversationChainService,
    private readonly meta: DocumentConversationChainServiceProps
  ) {
    this.defaultChatPrompt = `Use the following pieces of context to answer the question at the end.
                              {context}
                              Question: {question}
                              If you don't know the answer return only: Answer not found.
                              But if you have an answer provide the most detailed response you can.`;
  }

  async call({ input }: { input: string }) {
    const prompt = PromptTemplate.fromTemplate(this.defaultChatPrompt);

    for (const document of this.meta.documents) {
      const vectorStore =
        await this.vectorDbService.getVectorDbClientForExistingCollection(
          this.meta.roomId,
          document.meta.filename
        );

      const chain = new RetrievalQAChain({
        combineDocumentsChain: loadQAStuffChain(this.meta.llmModel, {
          prompt,
        }),
        retriever: vectorStore.asRetriever(),
        returnSourceDocuments: true,
        inputKey: 'input',
      });

      const res = await chain.call({
        input,
      });

      if (!res.text.includes('Answer not found.')) {
        await this.memoryService.createMemoryWithDocumentInput(
          this.meta.roomId,
          input,
          res.text
        );
        return { output: res.text, source: res.sourceDocuments };
      }
    }
    const simpleConversationChain =
      await this.simpleConversationChainService.getChain(
        this.meta.roomId,
        this.meta.llmModel,
        this.meta.summary
      );
    return simpleConversationChain.call({ input });
  }
}
