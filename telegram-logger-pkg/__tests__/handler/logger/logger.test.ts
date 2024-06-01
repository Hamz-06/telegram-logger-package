import { Logger } from "../../../src/handler/logger/logger";
import { ErrorInviteLinkMap, InviteLinkForTopic } from "../../../src/types/logger";

describe('Logger', () => {
  const botToken = 'your_bot_token';

  beforeEach(() => {
    Logger.reset()
  })
  describe('when invoking the logger twice', () => {
    it('should return the same instance when called', () => {
      const logger1 = Logger.initialise<'warn'>(botToken, {})
      const logger2 = Logger.initialise<'warn'>(botToken, {})

      expect(logger1).toBe(logger2)
    })
  })
  describe('when invoking the logger twice with diffent generic', () => {
    it('should return the same instance when called', () => {
      const logger1 = Logger.initialise<'warn' | 'info'>(botToken, {})
      const logger2 = Logger.initialise<'warn'>(botToken, {})

      expect(logger1).toBe(logger2)
    })
  })
  describe('when creating the logger with the same logger name', () => {
    it('should throw an error', () => {
      const logger1 = Logger.initialise<'warn' | 'info'>(botToken, {})
      const cb = () => logger1
        .with('warn', 'https://t.me/c/12/13')
        .with('warn', 'https://t.me/c/12/12')
      expect(cb).toThrow('Logger name must be unique')
    })
  })
  describe('when creating the logger with the same logger name in a differnt instance', () => {
    it('should throw an error', () => {
      //will throw an error as it's one instance (singleton instance)
      const logger1 = Logger.initialise<'warn' | 'info'>(botToken, {})
      const logger2 = Logger.initialise<'warn' | 'info'>(botToken, {})
      const cb = () => {
        logger1.with('warn', 'https://t.me/c/12/12')
        logger2.with('warn', 'https://t.me/c/12/14')
      }
      expect(cb).toThrow('Logger name must be unique')
    })
  })
  describe('with an invalid telegram url', () => {
    let incorrectTelegramUrl: InviteLinkForTopic
    beforeAll(() => {
      incorrectTelegramUrl = 'https://t.me/c/12/12/wrong' as InviteLinkForTopic
    })
    it('should throw an error', () => {
      const logger1 = Logger.initialise<'warn' | 'info'>(botToken, {})
      expect(() => logger1.with('warn', incorrectTelegramUrl)).toThrow('Invalid invite link')
    })
  })
})