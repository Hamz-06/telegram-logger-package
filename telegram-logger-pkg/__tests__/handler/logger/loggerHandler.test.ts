import { Logger } from '../../../src/handler/logger/logger';
import { MessageHandler } from '../../../src/handler/logger/messageHandler';
import { MessageSettings } from '../../../src/types/messageSetting';
import colors from 'colors';

const sendMessage = jest.fn();
jest.mock('../../../src/model/telegramBot', () => {
  return {
    TelegramBot: jest.fn().mockImplementation(() => {
      return {
        sendMessage: sendMessage,
      };
    }),
  };
});

describe('logger handler', () => {
  const botToken = 'your_bot_token';
  let logger: Logger<'info' | 'warn' | 'error'>;
  let defaultMessage: MessageSettings;
  let consoleLogSpy: jest.SpyInstance;

  describe('message settings', () => {
    beforeEach(() => {
      consoleLogSpy = jest.spyOn(console, 'log');
      Logger.reset();
      sendMessage.mockClear();
    });

    beforeAll(() => {
      defaultMessage = MessageHandler.constructSettings({});
    });

    describe('with display console logs settings', () => {
      type LogTestCase = ['info' | 'warn', string, string];
      beforeEach(() => {
        Logger.reset();
        consoleLogSpy.mockReset();
      });
      describe('#enabled', () => {
        beforeAll(() => {
          logger = Logger
            .initialise<'info' | 'warn'>(botToken, { ...defaultMessage, displayConsoleLogs: true })
            .with('info', 'https://t.me/c/12/12')
            .with('warn', 'https://t.me/c/12/13');
        });
        it.each<LogTestCase>([
          ['info', 'hello', 'info: hello'],
          ['warn', 'goodbye', 'warn: goodbye'],
        ])('should log %s: %s', async (level, message, expectedLog) => {
          await logger.logMessage(level, message);
          expect(consoleLogSpy).toHaveBeenCalledWith(expectedLog);
        });
      });

      describe('#disabled', () => {
        beforeAll(() => {
          logger = Logger
            .initialise<'info' | 'warn'>(botToken, { ...defaultMessage, displayConsoleLogs: false })
            .with('info', 'https://t.me/c/12/12')
            .with('warn', 'https://t.me/c/12/13');
        });
        it.each<LogTestCase>([
          ['info', 'hello', ''],
          ['warn', 'goodbye', ''],
        ])('should log %s: %s', async (level, message) => {
          await logger.logMessage(level, message);
          expect(consoleLogSpy).not.toHaveBeenCalled();
        });
      });
    });

    // TODO: FIX THIS TEXT so it detects color
    xdescribe('with use colored logs', () => {
      beforeEach(() => {
        Logger.reset();
      });
      describe('#enabled', () => {
        beforeAll(() => {
          logger = Logger
            .initialise<'info' | 'error'>(botToken, { ...defaultMessage, useColoredLogs: true })
            .with('info', 'https://t.me/c/12/12')
            .with('error', 'https://t.me/c/12/13');
        });
        it('should log with color', async () => {
          const logMessageColorExpected = colors.red('error:') + ' ' + 'hello';
          await logger.logMessage('error', 'hello');
          expect(consoleLogSpy).toHaveBeenCalledWith(logMessageColorExpected);
        });
      });
    });
    describe('with display time', () => {
      beforeEach(() => {
        Logger.reset();
      });
      describe('#enabled', () => {
        beforeAll(() => {
          logger = Logger
            .initialise<'info' | 'error'>(botToken, { ...defaultMessage, displayTime: true })
            .with('info', 'https://t.me/c/12/12')
            .with('error', 'https://t.me/c/12/13');

          jest.spyOn(Date, 'now').mockReturnValue(45633);
        });
        afterAll(() => {
          jest.restoreAllMocks();
        });
        it('should log with time', async () => {
          await logger.logMessage('error', 'hello');
          expect(sendMessage).toHaveBeenCalled();
          expect(consoleLogSpy).toHaveBeenCalledWith(`error 45633: hello`);
        });
      });
      describe('#disabled', () => {
        beforeAll(() => {
          logger = Logger
            .initialise<'info' | 'error'>(botToken, { ...defaultMessage, displayTime: false })
            .with('info', 'https://t.me/c/12/12')
            .with('error', 'https://t.me/c/12/13');
        });
        afterAll(() => {
          jest.restoreAllMocks();
        });
        it('should log with time', async () => {
          await logger.logMessage('error', 'hello');
          expect(sendMessage).toHaveBeenCalled();
          expect(consoleLogSpy).toHaveBeenCalledWith(`error: hello`);
        });
      });
    });
    describe('with display telegrams logs', () => {
      beforeEach(() => {
        Logger.reset();
      });
      describe('#disabled', () => {
        beforeAll(() => {
          logger = Logger
            .initialise<'info' | 'error'>(botToken, { ...defaultMessage, displayTelegramLogs: false })
            .with('info', 'https://t.me/c/12/12')
            .with('error', 'https://t.me/c/12/13');
        });
        it('should not log on telegram', async () => {
          await logger.logMessage('error', 'hello');
          expect(sendMessage).toHaveBeenCalledTimes(0);
          expect(consoleLogSpy).toHaveBeenCalledWith('error: hello');
        });
      });
      describe('#enabled', () => {
        beforeAll(() => {
          logger = Logger
            .initialise<'info' | 'error'>(botToken, { ...defaultMessage, displayTelegramLogs: true })
            .with('info', 'https://t.me/c/12/12')
            .with('error', 'https://t.me/c/12/13');
        });
        it('should log on telegram', async () => {
          await logger.logMessage('error', 'hello');
          expect(sendMessage).toHaveBeenCalledTimes(1);
          expect(consoleLogSpy).toHaveBeenCalledWith('error: hello');
        });
      });
    });
  });
});
