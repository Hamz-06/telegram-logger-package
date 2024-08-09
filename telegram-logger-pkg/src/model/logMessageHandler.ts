import { MessageSettings } from '../types/messageSetting';

interface Handler {
  setNext(handler: Handler): Handler;
  handle(settings: MessageSettings): void;
  get consoleLogMessage(): string;
  get telegramLogMessage(): string
  get defaultMessage(): string;
}

abstract class LogMessageHandler implements Handler {
  private nextHandler?: Handler;
  private static _consoleLogMessage = '';
  private static _telegramLogMessage = '';
  private static _defaultMessage = '';

  public setNext(handler: Handler): Handler {
    this.nextHandler = handler;
    return handler;
  }

  public handle(settings: MessageSettings) {
    if (this.nextHandler) {
      this.nextHandler.handle(settings);
    }
  }

  public get defaultMessage() {
    return LogMessageHandler._defaultMessage;
  }
  public get consoleLogMessage() {
    return LogMessageHandler._consoleLogMessage;
  }
  public get telegramLogMessage() {
    return LogMessageHandler._telegramLogMessage;
  }

  protected setDefaultMessage(defaultMessage: string):void {
    LogMessageHandler._defaultMessage = defaultMessage;
    LogMessageHandler._consoleLogMessage = defaultMessage;
    LogMessageHandler._telegramLogMessage = defaultMessage;
  }

  protected updateConsoleLogMessage(updatedMessage: string):void {
    LogMessageHandler._consoleLogMessage = updatedMessage;
  }

  protected updateTelegramLogMessage(updatedMessage: string):void {
    LogMessageHandler._telegramLogMessage = updatedMessage;
  }
}
export { LogMessageHandler };
