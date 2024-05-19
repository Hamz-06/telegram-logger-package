import { ChannelId, ErrorTopicMap, ErrorType, ILoggerHandler, Settings } from "../../types/logger";
import { MessageHandler } from "./messageHandler";

export class LoggerHandler implements ILoggerHandler {

  protected channelId: ChannelId;
  protected errorTopic: ErrorTopicMap;
  private messageHandler: MessageHandler;

  constructor(botToken: string, errorTopicMap: ErrorTopicMap, channelId: ChannelId, settings?: Settings) {
    const messageSettings = MessageHandler.constructSettings(settings);
    this.messageHandler = new MessageHandler(botToken, messageSettings, channelId, errorTopicMap);
    this.errorTopic = errorTopicMap;
    this.channelId = channelId;
  }

  private errorMessage(loggerType: ErrorType) {
    return `You have not configured the ${loggerType} logger, add it to your config`;
  }

  private async logMessage(message: string, type: ErrorType) {
    if (!this.errorTopic[type]) {
      console.error(this.errorMessage(type));
      return;
    }
    await this.messageHandler.sendMessage(message, type);
  }

  async warn(message: string) {
    await this.logMessage(message, 'warn');
  }

  async error(message: string) {
    await this.logMessage(message, 'error');
  }

  async info(message: string) {
    await this.logMessage(message, 'info');
  }
}
