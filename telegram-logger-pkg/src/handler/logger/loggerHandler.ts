
import { ILoggerHandler, Settings } from "../../types/logger";
import TelegramBot from 'node-telegram-bot-api';

export abstract class LoggerHandler implements ILoggerHandler {
  protected telegramBot: TelegramBot;
  private channelId: string;
  private settings?: string[]; // need to find id of the chat

  public constructor(token: string, channelId: string, settings?: Settings) {
    this.telegramBot = new TelegramBot(token);
    this.channelId = channelId;
  }

  debug(message: string): void {

  }
  error(message: string): void {

  }
  async info(message: string) {
    const sendMessage = await this.telegramBot.sendMessage(this.channelId, message, { message_thread_id: 2 })
    console.log(sendMessage)
    return sendMessage
  }
  // async getStatus() {
  //   try {
  //     const getChannel = await this.telegramBot.getUpdates()
  //     console.log(JSON.stringify(getChannel, null, 2))
  //     return getChannel
  //   } catch (error) {

  //   }

  // }
}