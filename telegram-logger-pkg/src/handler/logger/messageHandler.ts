import TelegramBot from "node-telegram-bot-api";
import { ChannelId, ErrorColorEmum, ErrorColorMap, ErrorTopicMap, ErrorType, Settings, TopicId } from "../../types/logger"
import { MessageSettings } from "../../types/messageSetting"

class MessageHandler {
  private messageSettings: MessageSettings;
  private telegramBot: TelegramBot
  private errorTopicMap: ErrorTopicMap
  private channelId: ChannelId
  private errorColorMap: ErrorColorMap = {
    'info': ErrorColorEmum.info,
    'error': ErrorColorEmum.error,
    'debug': ErrorColorEmum.debug
  }

  constructor(botToken: string, settings: MessageSettings, channelId: ChannelId, errorTopicMap: ErrorTopicMap) {
    this.telegramBot = new TelegramBot(botToken);
    this.errorTopicMap = errorTopicMap;
    this.channelId = channelId;
    this.messageSettings = settings;
  }

  async sendMessage(message: string, errorMessage: ErrorType) {
    const topicId = this.errorTopicMap[errorMessage] as number // should be validated in the logger handler (so cast is fine)
    const telegramMessageSetting = this.createTelegramMessageSetting(topicId)
    await this.telegramBot.sendMessage(this.channelId, message, telegramMessageSetting)
    //logs for console
    if (this.messageSettings?.displayConsoleLogs) {
      this.displayConsoleLogs(message, errorMessage)
    }
  }

  private displayConsoleLogs(message: string, errorMessage: ErrorType) {
    const errorColor = this.errorColorMap[errorMessage]
    console.log(`${errorColor}${message}`)
  }

  private createTelegramMessageSetting(topicId: TopicId): TelegramBot.SendMessageOptions {
    const messageSetting: TelegramBot.SendMessageOptions = {}
    if (topicId !== 1) {
      messageSetting.message_thread_id = topicId
    }
    return messageSetting
  }

  static constructSettings(settings?: Settings): MessageSettings {
    if (!settings) return {}
    return {
      displayConsoleLogs: settings.displayConsoleLogs,
      showErrorStackTrace: settings.showErrorStackTrace
    }
  }
}
export { MessageHandler }