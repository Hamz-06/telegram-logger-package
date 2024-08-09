import { ChannelId, TelegramInviteLink, ErrorTopicMap } from '../../src/types/logger';

type IsNumberParam = 'channelId' | 'topicId'

class ChatTopic {
  private errorTopicMap: ErrorTopicMap = {};
  private channelIdSet = new Set<ChannelId>();
  private loggerNameSet = new Set<string>();
  private topicIdSet = new Set<number>();

  public get channelId(): string {
    if (this.channelIdSet.size <= 0) {
      throw new Error('No channelId');
    }
    return this.channelIdSet.values().next().value;
  }
  // TODO:ADD VALIDATION HERE
  public getTopicId(loggerName: string): number {
    const topicId = this.errorTopicMap[loggerName] || -1;
    if (topicId === -1) {
      throw new Error(`No topicId found for ${loggerName}, please add it in the initialisation`);
    }
    return topicId;
  }

  validate(loggerName: string, loggerInviteLink: TelegramInviteLink): void {
    const _loggerSizeBefore = this.loggerNameSet.size;
    const _topicIdSizBefore = this.topicIdSet.size;

    const { channelId, topicId } = ChatTopic.getChatId(loggerInviteLink);

    const newChannelId = ChatTopic.createChannelId(channelId);

    this.channelIdSet.add(newChannelId);
    this.loggerNameSet.add(loggerName);
    this.topicIdSet.add(topicId);

    const _loggerSizeAfter = this.loggerNameSet.size;
    const _channelIdSizeAfter = this.channelIdSet.size;
    const _topicIdSizeAfter = this.topicIdSet.size;

    // has to be unique
    if (_topicIdSizeAfter <= _topicIdSizBefore) {
      throw new Error('Topic Id must be unique');
    }
    if (_loggerSizeAfter === _loggerSizeBefore) {
      throw new Error('Logger name must be unique');
    }
    if (_channelIdSizeAfter > 1) {
      throw new Error('Channel Id must be the same for all channels');
    }
    this.errorTopicMap[loggerName] = topicId;
  }
  // TODO: add more validation
  private static createChannelId = (channelId: ChannelId) => {
    return `-100${channelId}`;
  };

  private static validateInviteLink = (inviteLink: TelegramInviteLink) => {
    // eslint-disable-next-line no-useless-escape
    const urlPattern = new RegExp('^https:\/\/t\\.me\\/c\\/\\d+\\/\\d+$');
    if (!urlPattern.test(inviteLink)) {
      throw new Error('Invalid invite link');
    }
  };
  private static getChatId(chatInviteLink: TelegramInviteLink) {
    ChatTopic.validateInviteLink(chatInviteLink);

    const split = chatInviteLink.split('/');
    const topicNumberId = ChatTopic.isNumber(split[5] as string, 'topicId');
    return {
      channelId: split[4] as ChannelId,
      topicId: topicNumberId,
    };
  }
  private static isNumber(value: string, type: IsNumberParam): number {
    const intValue = Number(value);
    if (isNaN(intValue)) throw new Error(`Invalid ${type} ${value}, must be a number`);
    return intValue;
  }
}
export { ChatTopic };
