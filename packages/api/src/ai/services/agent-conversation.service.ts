import { MemoryService } from '@/ai/services/memory.service';
import { ToolService } from '@/ai/services/tool.service';
import { ChatDocument } from '@/common/types/chat';
import { Injectable } from '@nestjs/common';
import {
  AgentExecutor,
  initializeAgentExecutorWithOptions,
} from 'langchain/agents';
import { BaseChatModel } from 'langchain/chat_models';
import { BufferMemory } from 'langchain/memory';
import { Calculator } from 'langchain/tools/calculator';

@Injectable()
export class AgentConversationService {
  agentMap: Map<string, AgentExecutor>;

  constructor(
    private readonly memoryService: MemoryService,
    private readonly toolService: ToolService
  ) {
    this.agentMap = new Map<string, AgentExecutor>();
  }

  async getAgent(
    roomId: string,
    llmModel: BaseChatModel,
    documents: ChatDocument[],
    summary?: string
  ): Promise<AgentExecutor> {
    if (!this.hasAgent(roomId) || !!summary) {
      await this.createAgent(roomId, llmModel, documents, summary);
    }

    return this.agentMap.get(roomId);
  }

  private hasAgent(roomId: string) {
    return this.agentMap.has(roomId);
  }

  private async createAgent(
    roomId: string,
    llmModel: BaseChatModel,
    documents: ChatDocument[],
    summary?: string
  ) {
    const agentDocumentTools = await this.toolService.getDocumentQATools(
      llmModel,
      documents
    );

    const agent = await initializeAgentExecutorWithOptions(
      [new Calculator(), ...agentDocumentTools],
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
}
