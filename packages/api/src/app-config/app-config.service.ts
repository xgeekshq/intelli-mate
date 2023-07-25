import { AppConfigNotFoundException } from '@/app-config/exceptions/app-config-not-found.exception';
import { Injectable } from '@nestjs/common';
import * as appConfig from 'config';

export type AiAppConfig = {
  defaultTemperature: number;
  defaultChatContextTTL: number;
  defaultTokenLimitForSummarization: number;
};

@Injectable()
export class AppConfigService {
  getAiAppConfig(): AiAppConfig {
    if (!appConfig.has('ai')) {
      throw new AppConfigNotFoundException();
    }

    return appConfig.get<AiAppConfig>('ai');
  }

  async getAppRoles(): Promise<string[]> {
    if (!appConfig.has('authorization.roles')) {
      throw new AppConfigNotFoundException();
    }

    return Promise.resolve(appConfig.get<string[]>('authorization.roles'));
  }

  getDefaultRole(): string {
    if (!appConfig.has('authorization.defaultRole')) {
      throw new AppConfigNotFoundException();
    }

    return appConfig.get<string>('authorization.defaultRole');
  }
}
