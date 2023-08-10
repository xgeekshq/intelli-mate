import { AgentConversationService } from '@/ai/services/agent-conversation.service';
import { MemoryService } from '@/ai/services/memory.service';
import { SimpleConversationChainService } from '@/ai/services/simple-conversation-chain.service';
import { VectorDbService } from '@/ai/services/vector-db.service';
import { AppConfigService } from '@/app-config/app-config.service';
import { RedisChatMemoryNotFoundException } from '@/chats/exceptions/redis-chat-memory-not-found.exception';
import { ChatDocument } from '@/common/types/chat';
import { Injectable, Logger } from '@nestjs/common';
import { AgentExecutor } from 'langchain/agents';
import {
  ConversationChain,
  LLMChain,
  loadSummarizationChain,
} from 'langchain/chains';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { Document } from 'langchain/document';
import { PromptTemplate } from 'langchain/prompts';
import { BaseMessage, ChainValues } from 'langchain/schema';

type AIExecutor = AgentExecutor | ConversationChain;

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly llmModel: ChatOpenAI;
  private readonly documentSummarizePrompt = PromptTemplate.fromTemplate(
    `Given the following context, identify the main actor or topic. Your answer should be 1 word.
Context:
{context}

Helpful answer:`
  );

  constructor(
    private readonly simpleConversationChainService: SimpleConversationChainService,
    private readonly agentConversationService: AgentConversationService,
    private readonly appConfigService: AppConfigService,
    private readonly memoryService: MemoryService,
    private readonly vectorDbService: VectorDbService
  ) {
    this.llmModel = new ChatOpenAI({
      temperature: this.appConfigService.getAiAppConfig().defaultTemperature,
      modelName: this.appConfigService.getAiAppConfig().defaultAiModel,
    });
  }

  async askAiInFreeText(
    input: string,
    roomId: string,
    shouldSummarize: boolean,
    documents: ChatDocument[]
  ): Promise<string> {
    let summary: ChainValues;
    let aiExecutor: AIExecutor;

    if (shouldSummarize) {
      summary = await this.askAiToSummarize(roomId);
    }

    if (documents.length > 0) {
      aiExecutor = await this.agentConversationService.getAgent(
        roomId,
        this.llmModel,
        documents,
        summary?.response
      );
    } else {
      aiExecutor = await this.simpleConversationChainService.getChain(
        roomId,
        this.llmModel,
        summary?.response
      );
    }

    try {
      const aiResponse = await aiExecutor.call({ input });
      return aiResponse.response ?? aiResponse.output;
    } catch (e) {
      this.logger.error(
        `Failed to ask AI in room ${roomId} for a response for question: `,
        {
          question: input,
        }
      );
    }
  }

  async askAiToDescribeDocument(lcDocuments: Document[]): Promise<{
    name: string;
    description: string;
  }> {
    try {
      const titleChain = new LLMChain({
        llm: this.llmModel,
        prompt: this.documentSummarizePrompt,
      });
      const summarizationChain = loadSummarizationChain(this.llmModel, {
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
          error: e.message,
        }
      );
    }
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
          error: e.message,
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
          error: e.message,
        }
      );
    }
  }

  private async askAiToSummarize(roomId: string): Promise<ChainValues> {
    this.logger.log(`Creating summarization for room ${roomId} chat`);

    const chain = await this.simpleConversationChainService.getChain(
      roomId,
      this.llmModel
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
          error: e.message,
        }
      );
    }
  }
}
