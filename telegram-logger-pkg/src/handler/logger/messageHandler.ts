import { ChannelId, ErrorTopicMap, ErrorType, Settings } from "../../types/logger"
import { MessageSettings } from "../../types/messageSetting"
import colors from 'colors'
import { TelegramBot } from "../../model/telegramBot";

class MessageHandler {
  private messageSettings: MessageSettings;
  private telegramBot: TelegramBot
  private errorTopicMap: ErrorTopicMap
  private channelId: ChannelId

  private errorColorMap: Record<ErrorType, (message: string) => void> = {
    'info': (message: string) => colors.white(message),
    'warn': (message: string) => colors.yellow(message),
    'error': (message: string) => colors.underline(message),
  }

  constructor(botToken: string, settings: MessageSettings, channelId: ChannelId, errorTopicMap: ErrorTopicMap) {
    this.telegramBot = new TelegramBot(botToken);
    this.errorTopicMap = errorTopicMap;
    this.channelId = channelId;
    this.messageSettings = settings;
  }

  async sendMessage(message: string, errorMessage: ErrorType) {
    // should be validated in the logger handler (so cast is fine)
    const topicId = this.errorTopicMap[errorMessage] as number

    await this.telegramBot.sendMessage(this.channelId, message, topicId)
    //logs for console
    if (this.messageSettings?.displayLogs) {
      this.displayConsoleLogs(message, errorMessage)
    }
  }

  // TODO: implement a better way to build a error message 
  private displayConsoleLogs(message: string, errorType: ErrorType) {
    const useColoredLogs = this.messageSettings?.useColoredLogs
    if (typeof useColoredLogs === 'undefined' || this.messageSettings?.useColoredLogs === false) {
      console.log(message)
    } else {
      const logColor = this.errorColorMap[errorType]
      console.log(logColor(message))
    }
  }


  static constructSettings(settings?: Settings): MessageSettings {
    if (!settings) return {}
    return {
      displayLogs: settings.displayLogs,
      useColoredLogs: settings.useColoredLogs,
      displayStackTrace: settings.displayStackTrace
    }
  }
}

export { MessageHandler }