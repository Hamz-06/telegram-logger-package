import { Settings, TelegramChannels } from '../../types/logger';
import { LoggerHandler } from './loggerHandler';

export class Logger<T extends string> extends LoggerHandler<T> {
  constructor(botToken: string, telegramChannels: TelegramChannels<T>, settings?: Settings) {
    super(botToken, settings);
    this.addChannels(telegramChannels);
  }
}
