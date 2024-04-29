
import { ChatTopic } from '../../model/chatTopic';
import { ErrorInviteLinkMap, Settings } from '../../types/logger';
import { LoggerHandler } from './loggerHandler';

export class Logger extends LoggerHandler {
  static logger: Logger;

  static initialise(botToken: string, errorInviteLink: ErrorInviteLinkMap, settings?: Settings) {
    if (!Logger.logger) {
      const { channelId, errorTopicMap } = ChatTopic.validate(errorInviteLink)
      Logger.logger = new Logger(botToken, errorTopicMap, channelId, settings);
    }
    return Logger.logger;
  }
  static getInstance(): Logger {
    if (!Logger.logger) {
      throw new Error('Logger is not initialized. Call initialize method first.');
    }
    return Logger.logger;
  }
}
