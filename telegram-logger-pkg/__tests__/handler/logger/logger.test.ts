import { Logger } from '../../../src/handler/logger/logger';
import { TelegramChannels, TelegramInviteLink } from '../../../src/types/logger';

type ExampleChannel = 'warn' | 'info'

describe('Logger', () => {
  const botToken = 'your_bot_token';
  const telegramChannels: TelegramChannels<ExampleChannel> ={
    warn: 'https://t.me/c/12/13',
    info: 'https://t.me/c/12/12',
  };

  describe('when invoking the logger twice', () => {
    it('should return two different instances when called', () => {
      const logger1 = new Logger(botToken, telegramChannels, {});
      const logger2 = new Logger(botToken, telegramChannels, {});

      expect(logger1).not.toBe(logger2);
    });
  });

  describe('with an empty setting option', () => {
    it('should pass and use the default setting', ()=>{
      const logger1 = ()=>new Logger(botToken, telegramChannels);
      expect(logger1).not.toThrow();
    });
  });


  describe('with an invalid telegram url', () => {
    describe('with duplicate telegram URLs', ()=>{
      it('should throw an error', () => {
        const duplicateChannels: TelegramChannels<ExampleChannel> ={
          warn: 'https://t.me/c/12/12',
          info: 'https://t.me/c/12/12',
        };
        const logger1 =()=> new Logger<ExampleChannel>(botToken, duplicateChannels);
        expect(logger1).toThrow();
      });
    });

    describe('with invalid telegram url', ()=>{
      let invalidTelegramChannel: TelegramChannels<ExampleChannel>;

      beforeAll(() => {
        const incorrectTelegramUrl = 'https://t.me/c/12/12/wrong' as TelegramInviteLink;
        invalidTelegramChannel= {
          info: incorrectTelegramUrl,
          warn: 'https://t.me/c/12/13',
        };
      });

      it('should throw an error', ()=>{
        const logger1 =()=> new Logger<ExampleChannel>(botToken, invalidTelegramChannel);
        expect(logger1).toThrow();
      });
    });
  });
});
