import { MemoryService } from '@/ai/services/memory.service';
import { Injectable } from '@nestjs/common';
import {
  AgentExecutor,
  initializeAgentExecutorWithOptions,
} from 'langchain/agents';
import { ConversationChain } from 'langchain/chains';
import { BaseChatModel } from 'langchain/chat_models';
import { BufferMemory } from 'langchain/memory';
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  MessagesPlaceholder,
} from 'langchain/prompts';

@Injectable()
export class ChainService {
  chainMap: Map<string, ConversationChain>;
  agentMap: Map<string, AgentExecutor>;
  defaultChatPrompt: ChatPromptTemplate;

  constructor(private readonly memoryService: MemoryService) {
    this.chainMap = new Map<string, ConversationChain>();
    this.agentMap = new Map<string, AgentExecutor>();
    this.defaultChatPrompt = ChatPromptTemplate.fromPromptMessages([
      new MessagesPlaceholder('history'),
      HumanMessagePromptTemplate.fromTemplate('{input}'),
    ]);
  }

  async getAgent(
    roomId: string,
    llmModel: BaseChatModel,
    summary?: string
  ): Promise<AgentExecutor> {
    if (!this.hasAgent(roomId) || !!summary) {
      await this.createAgent(roomId, llmModel, summary);
    }

    return this.agentMap.get(roomId);
  }

  private hasAgent(roomId: string) {
    return this.agentMap.has(roomId);
  }

  private async createAgent(
    roomId: string,
    llmModel: BaseChatModel,
    summary?: string
  ) {
    const agent = await initializeAgentExecutorWithOptions(
      [
        /* TODO: add the doc consulting tools */
      ],
      llmModel,
      {
        agentType: 'chat-conversational-react-description',
        memory: new BufferMemory({
          returnMessages: true,
          memoryKey: 'chat_history',
          chatHistory: this.memoryService.getMemory(roomId, summary)
            .chatHistory,
        }),
      }
    );

    this.agentMap.set(roomId, agent);
  }

  getChain(
    roomId: string,
    llmModel: BaseChatModel,
    summary?: string
  ): ConversationChain {
    if (!this.hasChain(roomId) || !!summary) {
      this.createChain(roomId, llmModel, summary);
    }

    return this.chainMap.get(roomId);
  }

  private hasChain(roomId: string): boolean {
    return this.chainMap.has(roomId);
  }

  private createChain(
    roomId: string,
    llmModel: BaseChatModel,
    summary?: string
  ) {
    this.chainMap.set(
      roomId,
      new ConversationChain({
        llm: llmModel,
        prompt: this.defaultChatPrompt,
        memory: this.memoryService.getMemory(roomId, summary),
      })
    );
  }
}
