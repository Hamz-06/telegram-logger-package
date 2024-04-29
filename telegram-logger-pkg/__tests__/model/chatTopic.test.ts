
import { ChatTopic } from '../../src/model/chatTopic'
describe('chatTopic model', () => {
  describe('when given a a chat invite link', () => {
    it('should return the channelId and topicId', () => {
      const chatId = ChatTopic.getChatId('https://t.me/c/2100966300/5')
      console.log(chatId)
    })

  })
})