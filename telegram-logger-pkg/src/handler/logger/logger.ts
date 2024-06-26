/* eslint-disable @typescript-eslint/no-explicit-any */
import { TelegramInviteLink, Settings } from '../../types/logger';
import { LoggerHandler } from './loggerHandler';

export class Logger<T extends string> extends LoggerHandler<T> {
  // TODO: find a way to remove any type
  private static logger: Logger<any> | null;

  static initialise<T extends string>(botToken: string, settings?: Settings): Logger<T> {
    if (!Logger.logger) {
      Logger.logger = new Logger<T>(botToken, settings);
    }
    return Logger.logger;
  }
  static reset() {
    Logger.logger = null;
  }

  with(loggerName: T, loggerInviteLink: TelegramInviteLink): Logger<T> {
    this.appendNewChannel(loggerName, loggerInviteLink);
    return this;
  }
}
