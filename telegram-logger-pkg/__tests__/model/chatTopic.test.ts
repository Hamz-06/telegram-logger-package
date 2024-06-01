
import { ChatTopic } from '../../src/model/chatTopic'
import { InviteLinkForTopic } from '../../src/types/logger'

describe('chatTopic model', () => {
  let chatTopicValidator: ChatTopic
  describe('when given a a chat a valid invite link', () => {
    beforeAll(() => {
      chatTopicValidator = new ChatTopic()
    })
    it('should return void with no errors ', () => {
      const validate = () => {
        chatTopicValidator.validate('warn', 'https://t.me/c/12356/5')
        chatTopicValidator.validate('info', 'https://t.me/c/12356/4')
      }

      expect(validate).not.toThrow()
    })
  })

  describe('when given a multiple channel id in url', () => {
    beforeAll(() => {
      chatTopicValidator = new ChatTopic()
    })
    it('should throw an error', () => {
      const validate = () => {
        chatTopicValidator.validate('warn', 'https://t.me/c/12356/5')
        chatTopicValidator.validate('info', 'https://t.me/c/12356999/4')
      }
      expect(validate).toThrow('Channel Id must be the same for all channels')
    })
  })
  describe('when given a multiple topic id in url', () => {
    beforeAll(() => {
      chatTopicValidator = new ChatTopic()
    })
    it('should throw an error', () => {
      const validate = () => {
        chatTopicValidator.validate('warn', 'https://t.me/c/12356/5')
        chatTopicValidator.validate('info', 'https://t.me/c/12356/5')
      }
      expect(validate).toThrow('Topic Id must be unique')
    })
  })
  describe('when topic id is not a stringified number', () => {
    beforeAll(() => {
      chatTopicValidator = new ChatTopic()
    })
    it('should throw an error', () => {
      const validate = () => {
        chatTopicValidator.validate('warn', 'https://t.me/c/12356/WRONG' as InviteLinkForTopic) //force conversion
      }
      expect(validate).toThrow('Invalid invite link')
    })
  })

  describe('when the channel id is not a stringified number', () => {
    beforeAll(() => {
      chatTopicValidator = new ChatTopic()
    })
    it('should throw an error', () => {
      const validate = () => {
        chatTopicValidator.validate('warn', 'https://t.me/c/43/12') //force conversion
        chatTopicValidator.validate('warn', 'https://t.me/c/WRONG/12' as InviteLinkForTopic) //force conversion
      }
      expect(validate).toThrow('Invalid invite link')
    })
  })
  describe('with an invalid url', () => {
    let invalidUrls = [
      'htt://t.me12/cdl/431/12',  // Invalid URL scheme and structure
      'https://t.me/c//12345',    // Missing first number
      'https://t.me/c/12345/',    // Missing second number
      'https://t.me/c/abc/12345', // Non-numeric first number
      'https://t.me/c/12345/abc', // Non-numeric second number
      'http://t.me/c/12345/67890', // Invalid URL scheme (not https)
    ];;
    beforeAll(() => {
      chatTopicValidator = new ChatTopic();
    })
    it.each(invalidUrls)('should throw an error for invalid url: %s', (invalidUrl) => {
      const validate = () => {
        chatTopicValidator.validate('warn', invalidUrl as InviteLinkForTopic); // Force conversion
      }
      expect(validate).toThrow('Invalid invite link');
    });
  })
})