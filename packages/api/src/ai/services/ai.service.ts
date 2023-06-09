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
    });
  }

  async askAiInFreeText(input: string, chatId: string) {
    const chain = this.chainService.getChain(chatId, this.llmModel);

    try {
      return await chain.call({ input });
    } catch (e) {
      console.error(e.response.data);
    }
  }
}
