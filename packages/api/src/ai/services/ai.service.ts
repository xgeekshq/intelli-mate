import { AgentConversationService } from '@/ai/services/agent-conversation.service';
import { SimpleConversationChainService } from '@/ai/services/simple-conversation-chain.service';
import { AppConfigService } from '@/app-config/app-config.service';
import { ChatDocument } from '@/common/types/chat';
import { Injectable } from '@nestjs/common';
import { PromptTemplate } from 'langchain';
import { AgentExecutor } from 'langchain/agents';
import {
  ConversationChain,
  LLMChain,
  loadSummarizationChain,
} from 'langchain/chains';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { Document } from 'langchain/document';

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

  async askAiToDescribeDocument(documents: Document[]): Promise<{
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
      input_documents: documents,
    });

    const title = await titleChain.call({
      context: summary.text,
    });

    return {
      name: title.text.toLowerCase(),
      description: summary.text,
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
