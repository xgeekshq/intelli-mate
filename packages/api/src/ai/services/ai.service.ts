import { AgentConversationService } from '@/ai/services/agent-conversation.service';
import { MemoryService } from '@/ai/services/memory.service';
import { SimpleConversationChainService } from '@/ai/services/simple-conversation-chain.service';
import { AppConfigService } from '@/app-config/app-config.service';
import { RedisChatMemoryNotFoundException } from '@/chats/exceptions/redis-chat-memory-not-found.exception';
import { ChatDocument } from '@/common/types/chat';
import { Injectable } from '@nestjs/common';
import { AgentExecutor } from 'langchain/agents';
import { ConversationChain, RetrievalQAChain } from 'langchain/chains';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { VectorStoreRetriever } from 'langchain/vectorstores/base';

type AIExecutor = AgentExecutor | ConversationChain;

@Injectable()
export class AiService {
  llmModel: ChatOpenAI;

  constructor(
    private readonly simpleConversationChainService: SimpleConversationChainService,
    private readonly agentConversationService: AgentConversationService,
    private readonly appConfigService: AppConfigService,
    private readonly memoryService: MemoryService
  ) {
    this.llmModel = new ChatOpenAI({
      temperature: this.appConfigService.getAiAppConfig().defaultTemperature,
      modelName: 'gpt-3.5-turbo-16k',
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

  async askAiToDescribeDocument(
    vectorStoreRetriever: VectorStoreRetriever
  ): Promise<{
    name: string;
    description: string;
  }> {
    const chain = RetrievalQAChain.fromLLM(this.llmModel, vectorStoreRetriever);

    const title = await chain.call({
      query: 'Give me a single word that can reflect this document content',
    });
    const description = await chain.call({
      query: 'Summarize this document content in a single sentence. Be concise',
    });

    return {
      name: title.text.toLowerCase(),
      description: description.text,
    };
  }

  async getChatHistoryMessages(roomId: string) {
    const redisChatMemory = await (
      await this.memoryService.getMemory(roomId)
    ).chatHistory.getMessages();

    if (redisChatMemory) {
      return redisChatMemory;
    }

    throw new RedisChatMemoryNotFoundException();
  }

  private async askAiToSummarize(roomId: string) {
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
