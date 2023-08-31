import { AppConfigNotFoundException } from '@/app-config/exceptions/app-config-not-found.exception';
import { Role } from '@/common/types/user-roles';
import { Injectable } from '@nestjs/common';
import * as appConfig from 'config';

import { ai as aiAppConfig } from '../../config/default.json';

type AiAppConfig = typeof aiAppConfig;

@Injectable()
export class AppConfigService {
  getAiAppConfig(): AiAppConfig {
    if (!appConfig.has('ai')) {
      throw new AppConfigNotFoundException();
    }

    return appConfig.get<AiAppConfig>('ai');
  }
  async getAppRoles(): Promise<Role[]> {
    if (!appConfig.has('authorization.roles')) {
      throw new AppConfigNotFoundException();
    }

    return Promise.resolve(appConfig.get<Role[]>('authorization.roles'));
  }

  getDefaultRole(): string {
    if (!appConfig.has('authorization.defaultRole')) {
      throw new AppConfigNotFoundException();
    }

    return appConfig.get<string>('authorization.defaultRole');
  }
}
