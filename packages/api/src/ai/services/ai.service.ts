import { ChainService } from '@/ai/services/chain.service';
import { Injectable } from '@nestjs/common';
import * as config from 'config';
import { ChatOpenAI } from 'langchain/chat_models/openai';

// eslint-disable-next-line @typescript-eslint/no-var-requires
// const config = require('config');

@Injectable()
export class AiService {
  llmModel: ChatOpenAI;

  constructor(private readonly chainService: ChainService) {
    this.llmModel = new ChatOpenAI({
      temperature: config.get('ai.default-temperature'),
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
