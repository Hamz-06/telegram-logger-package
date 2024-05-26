import { Settings } from "../../types/logger"
import { MessageSettings } from "../../types/messageSetting"
import { TelegramBot } from "../../model/telegramBot";
import { ChatTopic } from "../../model/chatTopic";
import { defaultOptionTrue } from "../../util/util";
import { WithLogger, WithLoggerName } from "../../model/logBuilder";

class MessageHandler<T> {
  private messageSettings: MessageSettings;
  private telegramBot: TelegramBot
  private chatTopic: ChatTopic;

  constructor(botToken: string, chatTopic: ChatTopic, settings: MessageSettings) {
    this.telegramBot = new TelegramBot(botToken);
    this.chatTopic = chatTopic;
    this.messageSettings = settings;
  }

  async sendMessage(loggerName: T, message: string) {
    // should be validated in the logger handler (so cast is fine)

    const topicId = this.chatTopic.getTopicId(loggerName as string)

    const withLogger = new WithLogger(message)
    const withLoggerName = new WithLoggerName(loggerName as string)

    withLogger.setNext(withLoggerName)
    withLogger.handle(this.messageSettings);

    if (this.messageSettings.displayTelegramLogs) {
      await this.telegramBot.sendMessage(this.chatTopic.channelId, withLogger.defaultLoggerMessage, topicId)
    }
    if (this.messageSettings.displayConsoleLogs) {
      console.log(withLogger.loggerMessage)
    }
  }

  static constructSettings(settings?: Settings): MessageSettings {
    return {
      displayTelegramLogs: settings?.displayTelegramLogs ?? defaultOptionTrue(),
      displayConsoleLogs: settings?.displayConsoleLogs ?? defaultOptionTrue(),
      useColoredLogs: settings?.useColoredLogs ?? !defaultOptionTrue(),
      displayTime: settings?.displayTime ?? !defaultOptionTrue(),
      useLoggerName: settings?.useLoggerName ?? defaultOptionTrue(),
    }
  }
}

export { MessageHandler }