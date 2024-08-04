import { Logger } from '../../../src/handler/logger/logger';
import { MessageHandler } from '../../../src/handler/logger/messageHandler';
import { TelegramChannels } from '../../../src/types/logger';
import { MessageSettings } from '../../../src/types/messageSetting';
import colors from 'colors';

type ExampleChannel = 'warn' | 'info'

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
  let logger: Logger<ExampleChannel>;
  const telegramChannels: TelegramChannels<ExampleChannel> = {
    info: 'https://t.me/c/12/12',
    warn: 'https://t.me/c/12/13',
  };
  let defaultMessage: MessageSettings;
  let consoleLogSpy: jest.SpyInstance;

  describe('message settings', () => {
    beforeEach(() => {
      consoleLogSpy = jest.spyOn(console, 'log');
      sendMessage.mockClear();
    });

    beforeAll(() => {
      defaultMessage = MessageHandler.constructSettings({});
    });

    describe('with display console logs settings', () => {
      type LogTestCase = ['info' | 'warn', string, string];
      beforeEach(() => {
        consoleLogSpy.mockReset();
      });
      describe('#enabled', () => {
        beforeAll(() => {
          logger = new Logger(botToken, telegramChannels, { ...defaultMessage, displayConsoleLogs: true });
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
          logger = new Logger(botToken, telegramChannels, { ...defaultMessage, displayConsoleLogs: false });
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
      describe('#enabled', () => {
        beforeAll(() => {
          logger =new Logger(botToken, telegramChannels, { ...defaultMessage, useColoredLogs: true });
        });

        it('should log with color', async () => {
          const logMessageColorExpected = colors.red('error:') + ' ' + 'hello';
          await logger.logMessage('info', 'hello');
          expect(consoleLogSpy).toHaveBeenCalledWith(logMessageColorExpected);
        });
      });
    });
    describe('with display time', () => {
      describe('#enabled', () => {
        beforeEach(() => {
          logger = new Logger(botToken, telegramChannels, { ...defaultMessage, displayTime: true });
          jest.spyOn(Date.prototype, 'toISOString').mockReturnValue('2024-08-04T21:59:13.586Z');
        });

        it('should log with time', async () => {
          await logger.logMessage('info', 'hello');
          expect(sendMessage).toHaveBeenCalled();
          expect(consoleLogSpy).toHaveBeenCalledWith(`info 2024-08-04T21:59:13.586Z: hello`);
        });
      });
      describe('#disabled', () => {
        beforeAll(() => {
          logger =new Logger(botToken, telegramChannels, { ...defaultMessage, displayTime: false });
        });
        afterAll(() => {
          jest.restoreAllMocks();
        });
        it('should log with time', async () => {
          await logger.logMessage('info', 'hello');
          expect(sendMessage).toHaveBeenCalled();
          expect(consoleLogSpy).toHaveBeenCalledWith(`info: hello`);
        });
      });
    });
    describe('with display telegrams logs', () => {
      describe('#disabled', () => {
        beforeAll(() => {
          logger = new Logger(botToken, telegramChannels, { ...defaultMessage, displayTelegramLogs: false });
        });
        it('should not log on telegram', async () => {
          await logger.logMessage('info', 'hello');
          expect(sendMessage).toHaveBeenCalledTimes(0);
          expect(consoleLogSpy).toHaveBeenCalledWith('info: hello');
        });
      });
      describe('#enabled', () => {
        beforeAll(() => {
          logger = new Logger(botToken, telegramChannels, { ...defaultMessage, displayTelegramLogs: true });
        });
        it('should log on telegram', async () => {
          await logger.logMessage('info', 'hello');
          expect(sendMessage).toHaveBeenCalledTimes(1);
          expect(consoleLogSpy).toHaveBeenCalledWith('info: hello');
        });
      });
    });
    describe('when stack trace enabled', ()=>{
      const exampleError = new Error('example error');

      describe('#disabled', () => {
        beforeAll(() => {
          logger = new Logger(botToken, telegramChannels, { ...defaultMessage, displayStackTraceError: false });
        });
        it('should not log on telegram', async () => {
          await logger.logMessage('info', 'hello', { error: exampleError });
          expect(consoleLogSpy).toHaveBeenCalledWith(`info: hello ${colors.italic.dim('Error: example error')}`);
        });
      });

      // TODO: add test for additional info
    });
  });
});
