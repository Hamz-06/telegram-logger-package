import { Logger } from "../../../src/handler/logger/logger";
import { ErrorInviteLinkMap } from "../../../src/types/logger";

jest.mock('../../src/model/telegramBot', () => {
  return {
    TelegramBot: jest.fn().mockImplementation(() => {
      return {
        sendMessage: jest.fn(),
        constructUrl: jest.fn()
      };
    })
  };
});

describe('logger handler', () => {

  const botToken = 'your_bot_token';
  const errorInviteLink: ErrorInviteLinkMap = {
    'warn': 'https://t.me/c/123/5',
    'error': 'https://t.me/c/123/2',
    'info': 'https://t.me/c/123/1',
  };
  beforeAll(() => {
    Logger.initialise(botToken, errorInviteLink, {
      displayLogs: true
    });
  })
  describe('message settings', () => {

    describe('with displayLogs settings enabled', () => {
      let consoleLogSpy: jest.SpyInstance;
      beforeAll(() => {
        consoleLogSpy = jest.spyOn(console, 'log')
      })
      it('should log', async () => {
        await Logger.getInstance().info('hello')
        expect(consoleLogSpy).toHaveBeenCalledWith('hello')
      })
    })
  })
})

//TODO: add more tests for settings