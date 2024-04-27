
import { Settings } from '../../types';
import { LoggerHandler } from './loggerHandler';

export class Logger extends LoggerHandler {
  static logger: Logger;
  private constructor(botToken: string, channelId: string, settings?: Settings) {
    super(botToken, channelId, settings);
  }
  static initialise(botToken: string, channelId: string, settings?: Settings) {
    if (!Logger.logger) {
      Logger.logger = new Logger(botToken, channelId, settings);
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
