import { ChannelId, TopicId } from '../types/logger';
import axios from 'axios';
// Telegram docs
// https://core.telegram.org/bots/api#making-requests

type TelegramMethod = 'sendMessage'
type TelegramUrl = `https://api.telegram.org/bot${string}/${TelegramMethod}`

class TelegramBot {
  private botToken;

  constructor(botToken: string) {
    this.botToken = botToken;
  }
  async sendMessage(channelId: ChannelId, message: string, topicId: TopicId) {
    const messageUrl = this.constructUrl('sendMessage');
    messageUrl.searchParams.append('chat_id', channelId);
    messageUrl.searchParams.append('text', message);
    // thread id 1 is the main channel so dont use thread
    if (topicId !== 1) {
      messageUrl.searchParams.append('message_thread_id', topicId.toString());
    }

    try {
      await axios.post(messageUrl.toString());
    } catch (err) {
      // This block catches both network errors and re-thrown HTTP errors
      throw new Error(err instanceof Error ? err.message : String(err));
    }
  }

  private constructUrl(method: TelegramMethod): URL {
    const url: TelegramUrl = `https://api.telegram.org/bot${this.botToken}/${method}`;
    return new URL(url);
  }
}

export { TelegramBot };
