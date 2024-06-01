import { InviteLinkForTopic, Settings } from '../../types/logger';
import { LoggerHandler } from './loggerHandler';

export class Logger<T extends string> extends LoggerHandler<T> {
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

  with(loggerName: T, loggerInviteLink: InviteLinkForTopic): Logger<T> {
    this.appendNewChannel(loggerName, loggerInviteLink);
    return this;
  }
}
