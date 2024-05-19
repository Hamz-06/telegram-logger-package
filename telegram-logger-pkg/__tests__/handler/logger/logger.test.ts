import { Logger } from "../../../src/handler/logger/logger";
import { ErrorInviteLinkMap } from "../../../src/types/logger";

describe('Logger', () => {
  const botToken = 'your_bot_token';
  const errorInviteLink: ErrorInviteLinkMap = {
    'warn': 'https://t.me/c/123/5',
    'error': 'https://t.me/c/123/2',
    'info': 'https://t.me/c/123/1',
  };
  beforeAll(() => {
    Logger.initialise(botToken, errorInviteLink);
  })
  describe('when invoking the logger twice', () => {
    it('should return the same instance when called', () => {
      const logger1 = Logger.getInstance()
      const logger2 = Logger.getInstance()
      expect(logger1).toBe(logger2)
    })
  })
})