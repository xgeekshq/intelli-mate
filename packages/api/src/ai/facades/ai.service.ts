import { AgentConversationService } from '@/ai/services/agent-conversation.service';
import { MemoryService } from '@/ai/services/memory.service';
import { SimpleConversationChainService } from '@/ai/services/simple-conversation-chain.service';
import { VectorDbService } from '@/ai/services/vector-db.service';
import { AppConfigService } from '@/app-config/app-config.service';
import { RedisChatMemoryNotFoundException } from '@/chats/exceptions/redis-chat-memory-not-found.exception';
import { ChatDocument } from '@/common/types/chat';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
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
  llmModel: ChatOpenAI;

  constructor(
    private readonly simpleConversationChainService: SimpleConversationChainService,
    private readonly agentConversationService: AgentConversationService,
    private readonly appConfigService: AppConfigService,
    private readonly memoryService: MemoryService,
    private readonly configService: ConfigService,
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
    let summary;
    let aiExecutor: AIExecutor;

    if (shouldSummarize) {
      try {
        summary = await this.askAiToSummarize(roomId);
      } catch (e) {
        console.log(e);
      }
    }

    if (documents.length > 0) {
      aiExecutor = await this.agentConversationService.getAgent(
        roomId,
        this.llmModel,
        documents,
        summary
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
      console.error(e.response.data);
    }
  }

  async askAiToDescribeDocument(lcDocuments: Document[]): Promise<{
    name: string;
    description: string;
  }> {
    const prompt = PromptTemplate.fromTemplate(
      `Given the following context, identify the main actor or topic. Your answer should be 1 word.
Context:
{context}

Helpful answer:`
    );

    const titleChain = new LLMChain({ llm: this.llmModel, prompt });
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
    const vectorStore =
      await this.vectorDbService.getVectorDbClientForExistingCollection(
        roomId,
        filename
      );

    const documentList = await vectorStore.collection.get();

    await vectorStore.delete({ ids: documentList.ids });
  }

  async addDocumentsToVectorDBCollection(
    roomId: string,
    filename: string,
    lcDocuments: Document[]
  ): Promise<void> {
    const vectorStore = this.vectorDbService.getVectorDbClientForNewCollection(
      roomId,
      filename
    );

    await vectorStore.addDocuments(lcDocuments);
  }

  private async askAiToSummarize(roomId: string): Promise<ChainValues> {
    const chain = await this.simpleConversationChainService.getChain(
      roomId,
      this.llmModel
    );

    try {
      return await chain.call({
        input: 'Summarize this conversation using about 700 tokens',
      });
    } catch (e) {
      console.error(e.response.data);
    }
  }
}
