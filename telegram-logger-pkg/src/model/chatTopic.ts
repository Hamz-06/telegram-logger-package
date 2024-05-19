import { ChannelId, ErrorInviteLinkMap, ErrorTopicMap, ErrorType, InviteLinkForTopic, TopicId } from "../../src/types/logger"

type IsNumberParam = 'channelId' | 'topicId'


class ChatTopic {
  static validate(errorInviteLink: ErrorInviteLinkMap) {
    const errorTopicMap: ErrorTopicMap = {}
    const set = new Set<ChannelId>();

    Object.entries(errorInviteLink).map(([errorType, telegramInviteLink]) => {
      const { channelId, topicId } = ChatTopic.getChatId(telegramInviteLink)
      errorTopicMap[errorType as ErrorType] = topicId
      set.add(channelId)
    })
    if (set.size < 1) throw new Error(`You must provide a topic channel with the appropiate error type`)
    if (set.size !== 1) {
      throw new Error('Channel Id must be the same for all channels: ' + Array.from(set))
    }
    const channelId = this.isNumber(set.values().next().value, 'channelId')
    const createNewChannelId = ChatTopic.createChannelId(channelId.toString())
    return {
      channelId: createNewChannelId,
      errorTopicMap
    }
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