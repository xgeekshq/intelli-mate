import { ChainService } from '@/ai/services/chain.service';
import { AppConfigService } from '@/app-config/app-config.service';
import { Injectable } from '@nestjs/common';
import { ChatOpenAI } from 'langchain/chat_models/openai';

@Injectable()
export class AiService {
  llmModel: ChatOpenAI;

  constructor(
    private readonly chainService: ChainService,
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
    shouldSummarize: boolean
  ) {
    let summary;

    if (shouldSummarize) {
      try {
        summary = await this.askAiToSummarize(roomId);
      } catch (e) {
        console.log(e);
      }
    }

    const chain = this.chainService.getChain(
      roomId,
      this.llmModel,
      summary?.response
    );

    try {
      return await chain.call({ input });
    } catch (e) {
      console.error(e.response.data);
    }
  }

  private async askAiToSummarize(roomId: string) {
    const chain = this.chainService.getChain(roomId, this.llmModel);

    try {
      return await chain.call({
        input: 'Summarize this conversation using about 700 tokens',
      });
    } catch (e) {
      console.error(e.response.data);
    }
  }
}
