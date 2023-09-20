import { ChatModelService } from '@/ai/services/chat-model.service';
import { DocumentConversationChain } from '@/ai/services/document-conversation-chain.service';
import { MemoryService } from '@/ai/services/memory.service';
import { SimpleConversationChainService } from '@/ai/services/simple-conversation-chain.service';
import { VectorDbService } from '@/ai/services/vector-db.service';
import { AppConfigService } from '@/app-config/app-config.service';
import { RedisChatMemoryNotFoundException } from '@/chats/exceptions/redis-chat-memory-not-found.exception';
import { ChatDocument } from '@/common/types/chat';
import { Injectable, Logger } from '@nestjs/common';
import {
  ConversationChain,
  LLMChain,
  loadSummarizationChain,
} from 'langchain/chains';
import { Document } from 'langchain/document';
import { PromptTemplate } from 'langchain/prompts';
import { BaseMessage, ChainValues } from 'langchain/schema';

type AIExecutor = DocumentConversationChain | ConversationChain;
@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly documentSummarizePrompt = PromptTemplate.fromTemplate(
    `Given the following context, identify the main actor or topic. Your answer should be 1 word.
Context:
{context}

Helpful answer:`
  );

  constructor(
    private readonly simpleConversationChainService: SimpleConversationChainService,
    private readonly appConfigService: AppConfigService,
    private readonly memoryService: MemoryService,
    private readonly vectorDbService: VectorDbService,
    private readonly chatModelService: ChatModelService
  ) {}

  async askAiInFreeText(
    input: string,
    roomId: string,
    chatLlmId: string,
    shouldSummarize: boolean,
    documents: ChatDocument[]
  ): Promise<string> {
    let summary: ChainValues;
    let aiExecutor: AIExecutor;

    if (shouldSummarize) {
      summary = await this.askAiToSummarize(roomId, chatLlmId);
    }

    if (documents.length > 0) {
      aiExecutor = new DocumentConversationChain({
        memoryService: this.memoryService,
        vectorDbService: this.vectorDbService,
        simpleConversationChainService: this.simpleConversationChainService,
        llmModel: await this.chatModelService.getChatModel(chatLlmId),
        documents,
        roomId,
        summary: summary?.output,
      });
    } else {
      aiExecutor = await this.simpleConversationChainService.getChain(
        roomId,
        await this.chatModelService.getChatModel(chatLlmId),
        summary?.output
      );
    }

    try {
      const aiResponse = await aiExecutor.call({ input });
      return aiResponse.output;
    } catch (e) {
      this.logger.error(
        `Failed to ask AI in room ${roomId} for a response for question: `,
        {
          question: input,
          error: e,
          errorMessage: e.message,
          stack: e.stack,
        }
      );
    }
  }
  async askAiToDescribeDocument(
    lcDocuments: Document[],
    chatLlmId: string
  ): Promise<{
    name: string;
    description: string;
  }> {
    try {
      const llm = await this.chatModelService.getChatModel(chatLlmId);
      const titleChain = new LLMChain({
        llm,
        prompt: this.documentSummarizePrompt,
      });
      const summarizationChain = loadSummarizationChain(llm, {
        type: 'map_reduce',
      });

      const summary = await summarizationChain.call({
        input_documents: lcDocuments,
      });

      const title = await titleChain.call({
        context: summary.text,
      });

      return {
        name: title.text.toLowerCase(),
        description: summary.text,
      };
    } catch (e) {
      this.logger.error(
        'Failed to generate a document description from langchain documents. Error message: ',
        {
          error: e,
          errorMessage: e.message,
          stack: e.stack,
        }
      );
    }
  }

  async deleteChatHistoryMessages(roomId: string): Promise<void> {
    return this.memoryService.deleteMemory(roomId);
  }

  async getChatHistoryMessages(roomId: string): Promise<BaseMessage[]> {
    const redisChatMemory = await (
      await this.memoryService.getMemory(roomId)
    ).chatHistory.getMessages();

    if (redisChatMemory) {
      return redisChatMemory;
    }

    throw new RedisChatMemoryNotFoundException();
  }

  async removeVectorDBCollection(
    roomId: string,
    filename: string
  ): Promise<void> {
    this.logger.log(
      `Starting removal of documents for the room ${roomId}: file ${filename} from the vector store`
    );

    try {
      const vectorStore =
        await this.vectorDbService.getVectorDbClientForExistingCollection(
          roomId,
          filename
        );

      const documentList = await vectorStore.collection.get();

      await vectorStore.delete({ ids: documentList.ids });

      this.logger.log(
        `Documents were removed from the vector store for room ${roomId}: file ${filename}`
      );
    } catch (e) {
      this.logger.error(
        `Error while removing documents from vector store for room ${roomId}: file ${filename}. Error message: `,
        {
          error: e,
          errorMessage: e.message,
          stack: e.stack,
        }
      );
    }
  }

  async addDocumentsToVectorDBCollection(
    roomId: string,
    filename: string,
    lcDocuments: Document[]
  ): Promise<void> {
    this.logger.log(
      `Starting to add documents for the room ${roomId}: file ${filename} to the vector store`
    );

    try {
      const vectorStore =
        this.vectorDbService.getVectorDbClientForNewCollection(
          roomId,
          filename
        );

      await vectorStore.addDocuments(lcDocuments);

      this.logger.log(
        `Documents were added to the vector store for room ${roomId}: file ${filename}`
      );
    } catch (e) {
      this.logger.error(
        `Error while adding documents to vector store for room ${roomId}: file ${filename}. Error message: `,
        {
          error: e,
          errorMessage: e.message,
          stack: e.stack,
        }
      );
    }
  }

  private async askAiToSummarize(
    roomId: string,
    chatLlmId: string
  ): Promise<ChainValues> {
    this.logger.log(`Creating summarization for room ${roomId} chat`);

    const chain = await this.simpleConversationChainService.getChain(
      roomId,
      await this.chatModelService.getChatModel(chatLlmId)
    );

    try {
      const response = await chain.call({
        input: 'Summarize this conversation using about 700 tokens',
      });

      this.logger.log(
        `Finished summary for room ${roomId} chat with content: `,
        {
          content: response?.response,
        }
      );

      return response;
    } catch (e) {
      this.logger.error(
        `Error while summarizing message history for room ${roomId} chat. Error message: `,
        {
          error: e,
          errorMessage: e.message,
          stack: e.stack,
        }
      );
    }
  }
}
