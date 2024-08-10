import { ChatTopic } from '../../model/chatTopic';
import { ILoggerHandler, OptionalMessage, Settings, TelegramChannels } from '../../types/logger';
import { MessageHandler } from './messageHandler';
import colors from 'colors';

// TODO: possibly create singleton in the future to store bot and other stuff instead of passing it around the parameter
export class LoggerHandler<T extends string> implements ILoggerHandler<T> {
  private messageHandler: MessageHandler<T>;
  private chatTopic: ChatTopic;

  constructor(botToken: string, settings?: Settings) {
    const messageSettings = MessageHandler.constructSettings(settings);

    this.chatTopic = new ChatTopic();
    this.messageHandler = new MessageHandler<T>(botToken, this.chatTopic, messageSettings);
  }

  protected addChannels(telegramChannels: TelegramChannels<T>) {
    Object.keys(telegramChannels).forEach((loggerName) => {
      this.chatTopic.validate(loggerName, telegramChannels[loggerName as T]);
    });
  }

  public async logMessage(logType: T, message: string, optionalMessage?: OptionalMessage) {
    try {
      await this.messageHandler.sendMessage(logType, message, optionalMessage);
    } catch (error) {
      if (error instanceof Error) {
        // supress error
        console.log(colors.italic.dim(error.message));
      }
    }
  }
}
