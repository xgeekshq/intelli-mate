import { AgentConversationService } from '@/ai/services/agent-conversation.service';
import { SimpleConversationChainService } from '@/ai/services/simple-conversation-chain.service';
import { AppConfigService } from '@/app-config/app-config.service';
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
    private readonly appConfigService: AppConfigService
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
      console.log('Conversation Agent');
      aiExecutor = await this.agentConversationService.getAgent(
        roomId,
        this.llmModel,
        documents,
        summary
      );
    } else {
      console.log('Simple Conversation Chain');
      aiExecutor = this.simpleConversationChainService.getChain(
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

  private async askAiToSummarize(roomId: string) {
    const chain = this.simpleConversationChainService.getChain(
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
