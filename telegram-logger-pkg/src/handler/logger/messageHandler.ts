import { OptionalMessage, Settings } from '../../types/logger';
import { MessageSettings } from '../../types/messageSetting';
import { TelegramBot } from '../../model/telegramBot';
import { ChatTopic } from '../../model/chatTopic';
import { AppendErrorStackTrace, AppendColor, AppendLoggerDate, AppendLoggerName,
  AppendLoggerMessage } from '../../model/logBuilder';

class MessageHandler<T> {
  private messageSettings: MessageSettings;
  private telegramBot: TelegramBot;
  private chatTopic: ChatTopic;

  constructor(botToken: string, chatTopic: ChatTopic, settings: MessageSettings) {
    this.telegramBot = new TelegramBot(botToken);
    this.chatTopic = chatTopic;
    this.messageSettings = settings;
  }

  async sendMessage(loggerName: T, message: string, optionalMessage?: OptionalMessage) {
    // should be validated in the logger handler (so cast is fine)
    const topicId = this.chatTopic.getTopicId(loggerName as string);

    const appendLoggerName = new AppendLoggerName(loggerName as string);
    const appendLoggerDate = new AppendLoggerDate();
    const appendColor = new AppendColor(loggerName as string);
    const loggerMessage = new AppendLoggerMessage(message);
    const appendLoggerError = new AppendErrorStackTrace(optionalMessage);


    appendLoggerName.setNext(appendLoggerDate);
    appendLoggerDate.setNext(appendColor);
    appendColor.setNext(loggerMessage);
    loggerMessage.setNext(appendLoggerError);

    appendLoggerName.handle(this.messageSettings);

    console.log(`😡

      ${appendLoggerName.telegramLogMessage}
      ${appendLoggerName.consoleLogMessage}

      😡`);
    if (this.messageSettings.displayTelegramLogs) {
      await this.telegramBot.sendMessage(this.chatTopic.channelId, appendLoggerName.telegramLogMessage, topicId);
    }
    if (this.messageSettings.displayConsoleLogs) {
      console.log(appendLoggerName.consoleLogMessage);
    }
  }

  static constructSettings(settings?: Settings): MessageSettings {
    return {
      displayTelegramLogs: settings?.displayTelegramLogs ?? true,
      displayConsoleLogs: settings?.displayConsoleLogs ?? true,
      useColoredLogs: settings?.useColoredLogs ?? false,
      displayTime: settings?.displayTime ?? false,
      useLoggerName: settings?.useLoggerName ?? true,
      displayAdditionalInfoError: settings?.displayAdditionalInfoError ?? false,
      displayStackTraceError: settings?.displayStackTraceError?? false,
    };
  }
}

export { MessageHandler };
