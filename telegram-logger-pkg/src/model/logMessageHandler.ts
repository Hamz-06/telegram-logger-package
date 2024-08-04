import { MessageSettings } from '../types/messageSetting';

interface Handler {
  setNext(handler: Handler): Handler;
  handle(settings: MessageSettings): void;
  get loggerMessage(): string;
  get defaultLoggerMessage(): string;
}

abstract class LogMessageHandler implements Handler {
  private nextHandler?: Handler;
  protected static _loggerMessage = '';
  protected static _defaultMessage = '';

  public setNext(handler: Handler): Handler {
    this.nextHandler = handler;
    return handler;
  }

  public handle(settings: MessageSettings) {
    if (this.nextHandler) {
      this.nextHandler.handle(settings);
    }
  }

  public get defaultLoggerMessage() {
    return LogMessageHandler._defaultMessage;
  }

  public get loggerMessage() {
    return LogMessageHandler._loggerMessage;
  }
}
export { LogMessageHandler };
