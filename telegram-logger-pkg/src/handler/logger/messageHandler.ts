import TelegramBot from "node-telegram-bot-api";
import { ChannelId, Settings, TopicId } from "../../types/logger"
import { MessageSettings } from "../../types/messageSetting"

class MessageHandler {
  private messageSettings: MessageSettings | null = null;
  private telegramBot: TelegramBot
  constructor(botToken: string, settings?: Settings) {
    this.telegramBot = new TelegramBot(botToken);

    if (settings) {
      this.messageSettings = this.getMessageSettings(settings)
    }
  }
  async sendMessage(channelId: ChannelId, message: string, topicId: TopicId) {
    const telegramMessageSetting = this.createTelegramMessageSetting(topicId)
    await this.telegramBot.sendMessage(channelId, message, telegramMessageSetting)
    //logs for console
    if (this.messageSettings?.displayConsoleLogs) {
      console.log(message + '2')
    }
  }

  /**
   * Message settings for telegram bot send message
   */
  private createTelegramMessageSetting(topicId: TopicId): TelegramBot.SendMessageOptions {
    const messageSetting: TelegramBot.SendMessageOptions = {}
    if (topicId !== 1) {
      messageSetting.message_thread_id = topicId
    }
    return messageSetting
  }

  private getMessageSettings(settings: Settings): MessageSettings {
    return {
      displayConsoleLogs: settings.displayConsoleLogs,
      showErrorStackTrace: settings.showErrorStackTrace
    }
  }
}
export { MessageHandler }