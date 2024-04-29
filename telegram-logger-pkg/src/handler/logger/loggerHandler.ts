
import { ChannelId, ErrorTopicMap, ErrorType, ILoggerHandler } from "../../types/logger";
import { MessageHandler } from "./messageHandler";

export class LoggerHandler implements ILoggerHandler {

  protected channelId: ChannelId;
  protected errorTopic: ErrorTopicMap;
  private messageHandler: MessageHandler;

  public constructor(botToken: string, channelTopic: ErrorTopicMap, channelId: ChannelId) {

    this.messageHandler = new MessageHandler(botToken)
    this.errorTopic = channelTopic;
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
    await this.messageHandler.sendMessage(this.channelId, message, this.errorTopic.debug)
  }
  async error(message: string) {
    if (!this.errorTopic.error) {
      this.ErrorMessage('error')
      return;
    }
    await this.messageHandler.sendMessage(this.channelId, message, this.errorTopic.error)
  }
  async info(message: string) {
    if (!this.errorTopic.info) {
      this.ErrorMessage('info')
      return;
    }
    await this.messageHandler.sendMessage(this.channelId, message, this.errorTopic.info)
  }

}