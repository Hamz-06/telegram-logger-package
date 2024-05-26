import { ChatTopic } from "../../model/chatTopic";
import { ChannelId, ErrorTopicMap, ErrorType, ILoggerHandler, InviteLinkForTopic, Settings } from "../../types/logger";
import { MessageHandler } from "./messageHandler";
import colors from 'colors'

export class LoggerHandler<T> implements ILoggerHandler<T> {

  private messageHandler: MessageHandler<T>;
  private chatTopic: ChatTopic;

  constructor(botToken: string, settings?: Settings) {
    this.chatTopic = new ChatTopic();

    const messageSettings = MessageHandler.constructSettings(settings);
    this.messageHandler = new MessageHandler<T>(botToken, this.chatTopic, messageSettings);
    // this.errorTopic = errorTopicMap;
    // this.channelId = channelId;
  }

  protected appendNewChannel(loggerName: T, loggerInviteLink: InviteLinkForTopic) {
    this.chatTopic.validate(loggerName as string, loggerInviteLink)
  }

  public async logMessage(logType: T, message: string) {
    try {
      await this.messageHandler.sendMessage(logType, message);
    } catch (error) {
      if (error instanceof Error) {
        console.log(colors.italic.dim(error.message))
      }
    }
  }
}
