import { ChannelId, ErrorInviteLinkMap, ErrorTopicMap, ErrorType, InviteLinkForTopic, TopicId } from "../../src/types/logger"

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
      throw new Error(`Channel Id is not the same for all error types, 
      make sure you are in the same channel and create topics for that channel`)
    }
    const channelId = ChatTopic.getCorrectChannelId(set.values().next().value)
    return {
      channelId,
      errorTopicMap
    }
  }
  //TODO: add more validation
  static getCorrectChannelId = (channelId: ChannelId) => {
    return `-100${channelId}`
  }

  static getChatId(chatInviteLink: InviteLinkForTopic) {
    const split = chatInviteLink.split('/');
    // TODO: Add more validation check channelid length 
    if (split.length !== 6) throw new Error('Invalid invite link')
    const topicNumberId = ChatTopic.convertTopicIdToNumber(split[5] as string)
    return {
      channelId: split[4] as ChannelId,
      topicId: topicNumberId,
    };
  }
  static convertTopicIdToNumber(topicId: string): TopicId {
    const topicNumberId = parseInt(topicId)
    if (isNaN(topicNumberId)) throw new Error(`Invalid topic Id ${topicId}, must be a stringified number`)
    return topicNumberId
  }
}
export { ChatTopic }