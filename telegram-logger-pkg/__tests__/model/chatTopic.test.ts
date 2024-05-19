
import { ChatTopic } from '../../src/model/chatTopic'
import { ErrorInviteLinkMap } from '../../src/types/logger';
describe('chatTopic model', () => {
  let errorInviteLink: ErrorInviteLinkMap;
  describe('when given a a chat a valid invite link', () => {
    beforeAll(() => {
      errorInviteLink = {
        'warn': 'https://t.me/c/123/5',
        'error': 'https://t.me/c/123/2',
        'info': 'https://t.me/c/123/1',
      };
    })
    it('should return void with no errors ', () => {
      const { channelId, errorTopicMap } = ChatTopic.validate(errorInviteLink)
      expect(channelId).toBe('-100123')
      expect(errorTopicMap).toEqual({ "warn": 5, "error": 2, "info": 1 })
    })
  })

  describe('when given a multiple channel id in url', () => {
    beforeAll(() => {
      errorInviteLink = {
        'warn': 'https://t.me/c/12356/5',
        'error': 'https://t.me/c/123/2',
        'info': 'https://t.me/c/123/1',
      };
    })
    it('should throw an error', () => {
      expect(() => ChatTopic.validate(errorInviteLink)).toThrow('Channel Id must be the same for all channels: 12356,123')
    })
  })
  describe('when topic id is not a stringified number', () => {
    beforeAll(() => {
      errorInviteLink = {
        'warn': 'https://t.me/c/12356/g',
      };
    })
    it('should throw an error', () => {
      expect(() => ChatTopic.validate(errorInviteLink)).toThrow('Invalid topicId g, must be a number')
    })
  })

  describe('when the channel id is not a stringified number', () => {
    beforeAll(() => {
      errorInviteLink = {
        'warn': 'https://t.me/c/12356cccc/1',
      };
    })
    it('should throw an error', () => {
      expect(() => ChatTopic.validate(errorInviteLink)).toThrow('Invalid channelId 12356cccc, must be a number')
    })
  })
  describe('with an invalid url', () => {
    beforeAll(() => {
      errorInviteLink = {
        'warn': 'https://t.me/c/12356/g/hello',
      };
    })
    it('should throw an error', () => {
      expect(() => ChatTopic.validate(errorInviteLink)).toThrow('Invalid invite link')
    })
  })
})