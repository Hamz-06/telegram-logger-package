import colors from 'colors';
import { MessageSettings } from '../types/messageSetting';

// design pattern
// https://refactoring.guru/design-patterns/chain-of-responsibility

interface Handler {
  setNext(handler: Handler): Handler;
  handle(settings: MessageSettings): void;
  get loggerMessage(): string;
  get defaultLoggerMessage(): string
}

abstract class AbstractLogHandler implements Handler {
  private nextHandler!: Handler;
  static _loggerMessage = '';
  static _defaultMessage = '';

  public setNext(handler: Handler): Handler {
    this.nextHandler = handler;
    return handler;
  }

  public get defaultLoggerMessage() {
    return AbstractLogHandler._defaultMessage;
  }
  public get loggerMessage() {
    return AbstractLogHandler._loggerMessage;
  }

  public handle(settings: MessageSettings) {
    if (this.nextHandler) {
      return this.nextHandler.handle(settings);
    }
  }
}
class WithLogger extends AbstractLogHandler {
  private _logMessage: string;
  constructor(startMessage: string) {
    super();
    this._logMessage = startMessage;
  }
  public handle(settings: MessageSettings) {
    AbstractLogHandler._loggerMessage = this._logMessage;
    AbstractLogHandler._defaultMessage = this._logMessage;
    return super.handle(settings);
  }
}

class WithLoggerName extends AbstractLogHandler {
  private readonly loggerName: string;

  constructor(loggerName: string) {
    super();
    this.loggerName = loggerName;
  }
  private getColorFunction(strData: string): string {
    switch (this.loggerName) {
    case 'info':
      return colors.white(strData);
    case 'warn':
      return colors.yellow(strData);
    case 'error':
      return colors.red(strData);
    default:
      return colors.blue(strData);
    }
  }
  public handle(settings: MessageSettings) {
    let _loggerName = this.loggerName;

    const useColon = () => {
      const colon = ':';
      if (settings.useColoredLogs) {
        return this.getColorFunction(colon);
      }
      return colon;
    };

    if (!settings.useLoggerName) {
      return;
    }
    if (settings.displayTime) {
      const time = Date.now();
      _loggerName = this.loggerName + ' ' + time;
    }
    if (settings.useColoredLogs) {
      _loggerName = this.getColorFunction(this.loggerName);
    }
    AbstractLogHandler._loggerMessage = _loggerName + useColon() + ' ' + AbstractLogHandler._loggerMessage;
    return super.handle(settings);
  }
}
export { WithLoggerName, WithLogger };
