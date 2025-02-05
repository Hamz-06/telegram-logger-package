import { MessageSettings } from '../types/messageSetting';

interface Handler {
  setNext(handler: Handler): Handler;
  handle(settings: MessageSettings): void;
  get consoleMessage(): string;
  get telegramMessage(): string;

}

abstract class LogMessageHandler implements Handler {
  private nextHandler?: Handler;
  private static _consoleLogMessage = '';

  public setNext(handler: Handler): Handler {
    this.nextHandler = handler;
    return handler;
  }

  public handle(settings: MessageSettings) {
    if (this.nextHandler) {
      this.nextHandler.handle(settings);
    }
  }

  public get consoleMessage() {
    return LogMessageHandler._consoleLogMessage;
  }
  public get telegramMessage() {
    // eslint-disable-next-line no-control-regex
    const ansiRegex = /\u001b\[\d{1,2}m/g;
    return this.consoleMessage.replace(ansiRegex, '');
  }

  public cleanMessage(): void {
    LogMessageHandler._consoleLogMessage = '';
  }

  protected pushMessage(newMessage: string): void {
    LogMessageHandler._consoleLogMessage += newMessage;
  }
  protected updateMessage(updatedMessage: string): void {
    LogMessageHandler._consoleLogMessage = updatedMessage;
  }
}
export { LogMessageHandler };
