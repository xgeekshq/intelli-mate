import { MemoryService } from '@/ai/services/memory.service';
import { SimpleConversationChainService } from '@/ai/services/simple-conversation-chain.service';
import { VectorDbService } from '@/ai/services/vector-db.service';
import { ChatDocument } from '@/common/types/chat';
import { BaseChatModel } from '@langchain/core/language_models/chat_models';
import { PromptTemplate } from '@langchain/core/prompts';
import { Injectable } from '@nestjs/common';
import { RetrievalQAChain, loadQAStuffChain } from 'langchain/chains';

type DocumentConversationChainProps = {
  memoryService: MemoryService;
  vectorDbService: VectorDbService;
  simpleConversationChainService: SimpleConversationChainService;
  llmModel: BaseChatModel;
  documents: ChatDocument[];
  roomId: string;
  summary?: string;
};
@Injectable()
export class DocumentConversationChain {
  defaultChatPrompt: string;

  constructor(private readonly args: DocumentConversationChainProps) {
    this.defaultChatPrompt = `Use the following context to answer the question at the end.
                              {context}
                              Question: {question}
                              If you don't know the answer return only: Answer not found.
                              But if you have an answer, provide the most detailed response you can.`;
  }

  async call({ input }: { input: string }) {
    const prompt = PromptTemplate.fromTemplate(this.defaultChatPrompt);

    for (const document of this.args.documents) {
      const vectorStore =
        await this.args.vectorDbService.getVectorDbClientForExistingCollection(
          this.args.roomId,
          document.meta.filename
        );

      const chain = new RetrievalQAChain({
        combineDocumentsChain: loadQAStuffChain(this.args.llmModel, {
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
        await this.args.memoryService.createMemoryWithDocumentInput(
          this.args.roomId,
          input,
          res.text,
          this.args.summary
        );
        return {
          output: res.text,
          source: res.sourceDocuments,
          document: document.meta.filename,
        };
      }
    }
    const simpleConversationChain =
      await this.args.simpleConversationChainService.getChain(
        this.args.roomId,
        this.args.llmModel,
        this.args.summary
      );
    return simpleConversationChain.call({ input });
  }
}
