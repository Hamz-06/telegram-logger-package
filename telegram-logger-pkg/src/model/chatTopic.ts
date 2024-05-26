import { ChannelId, ErrorInviteLinkMap, ErrorTopicMap, ErrorType, InviteLinkForTopic, NewErrorTopicMap, TopicId } from "../../src/types/logger"

type IsNumberParam = 'channelId' | 'topicId'


class ChatTopic {
  private errorTopicMap: NewErrorTopicMap = {};
  private channelIdSet = new Set<ChannelId>();
  private loggerNameSet = new Set<string>();

  public get channelId(): string {

    if (this.channelIdSet.size <= 0) {
      throw new Error('No channelId')
    }
    return this.channelIdSet.values().next().value
  }
  // TODO:ADD VALIDATION HERE
  public getTopicId(loggerName: string): number {

    const topicId = this.errorTopicMap[loggerName] || -1
    if (topicId === -1) {
      throw new Error(`No topicId found for ${loggerName}`)
    }

    return topicId
  }

  validate(loggerName: string, loggerInviteLink: InviteLinkForTopic): void {

    const _loggerSizeBefore = this.loggerNameSet.size;
    const { channelId, topicId } = ChatTopic.getChatId(loggerInviteLink);

    const newChannelId = ChatTopic.createChannelId(channelId)

    this.channelIdSet.add(newChannelId);
    this.loggerNameSet.add(loggerName);

    const _loggerSizeAfter = this.loggerNameSet.size;
    const _channelIdSizeAfter = this.channelIdSet.size;

    if (_loggerSizeAfter === _loggerSizeBefore) {
      throw new Error('Logger name must be unique');
    }
    if (_channelIdSizeAfter > 1) {
      throw new Error('Channel Id must be the same for all channels');
    }
    this.errorTopicMap[loggerName] = topicId;

    // Object.entries(errorInviteLink).map(([errorType, telegramInviteLink]) => {
    //   errorTopicMap[errorType as ErrorType] = topicId
    //   set.add(channelId)
    // })
    // if (set.size < 1) throw new Error(`You must provide a topic channel with the appropiate error type`)
    // if (set.size !== 1) {
    //   throw new Error('Channel Id must be the same for all channels: ' + Array.from(set))
    // }
    // const channelId = this.isNumber(set.values().next().value, 'channelId')
    // const createNewChannelId = ChatTopic.createChannelId(channelId.toString())
    // return {
    //   channelId: '12',
    //   'error': 1
    // }
  }
  //TODO: add more validation
  private static createChannelId = (channelId: ChannelId) => {
    return `-100${channelId}`
  }

  private static getChatId(chatInviteLink: InviteLinkForTopic) {
    const split = chatInviteLink.split('/');
    // TODO: Add more validation check channelid length 
    if (split.length !== 6) throw new Error('Invalid invite link')
    const topicNumberId = ChatTopic.isNumber(split[5] as string, 'topicId')
    return {
      channelId: split[4] as ChannelId,
      topicId: topicNumberId,
    };
  }
  private static isNumber(value: string, type: IsNumberParam): number {
    const intValue = Number(value)
    if (isNaN(intValue)) throw new Error(`Invalid ${type} ${value}, must be a number`)
    return intValue
  }
}
export { ChatTopic }