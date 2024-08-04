import { ChatTopic } from '../../model/chatTopic';
import { ILoggerHandler, Settings, TelegramChannels } from '../../types/logger';
import { MessageHandler } from './messageHandler';
import colors from 'colors';

export class LoggerHandler<T extends string> implements ILoggerHandler<T> {
  private messageHandler: MessageHandler<T>;
  private chatTopic: ChatTopic;

  constructor(botToken: string, settings?: Settings) {
    this.chatTopic = new ChatTopic();

    const messageSettings = MessageHandler.constructSettings(settings);
    this.messageHandler = new MessageHandler<T>(botToken, this.chatTopic, messageSettings);
  }

  protected addChannels(telegramChannels: TelegramChannels<T>) {
    Object.keys(telegramChannels).forEach((loggerName) => {
      this.chatTopic.validate(loggerName, telegramChannels[loggerName as T]);
    });
  }

  public async logMessage(logType: T, message: string) {
    try {
      await this.messageHandler.sendMessage(logType, message);
    } catch (error) {
      if (error instanceof Error) {
        console.log(colors.italic.dim(error.message));
      }
    }
  }
}
