import { ChannelId, ErrorTopicMap, ErrorType, ILoggerHandler, Settings } from "../../types/logger";
import { MessageHandler } from "./messageHandler";

export class LoggerHandler implements ILoggerHandler {

  protected channelId: ChannelId;
  protected errorTopic: ErrorTopicMap;
  private messageHandler: MessageHandler;

  public constructor(botToken: string, errorTopicMap: ErrorTopicMap, channelId: ChannelId, settings?: Settings) {
    const messageSettings = MessageHandler.constructSettings(settings)
    this.messageHandler = new MessageHandler(botToken, messageSettings, channelId, errorTopicMap)
    this.errorTopic = errorTopicMap;
    this.channelId = channelId;
  }
  public getErrors() {
    return {
      channelId: this.channelId,
      errorTopicMap: this.errorTopic
    }
  }
  private ErrorMessage(loggerType: ErrorType) {
    return `You have not configure the ${loggerType} logger, add it to your config`
  }

  async debug(message: string) {
    if (!this.errorTopic.debug) {
      this.ErrorMessage('debug')
      return;
    }
    await this.messageHandler.sendMessage(message, 'debug')
  }
  async error(message: string) {
    if (!this.errorTopic.error) {
      this.ErrorMessage('error')
      return;
    }
    await this.messageHandler.sendMessage(message, 'error')
  }
  async info(message: string) {
    if (!this.errorTopic.info) {
      this.ErrorMessage('info')
      return;
    }
    await this.messageHandler.sendMessage(message, 'info')
  }

}