import colors from 'colors'
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
    return AbstractLogHandler._defaultMessage
  }
  public get loggerMessage() {
    return AbstractLogHandler._loggerMessage
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
    super()
    this._logMessage = startMessage
  }
  public handle(settings: MessageSettings) {
    AbstractLogHandler._loggerMessage = this._logMessage;
    AbstractLogHandler._defaultMessage = this._logMessage;
    return super.handle(settings);
  }
}

class WithLoggerName extends AbstractLogHandler {
  private _loggerName: string;

  constructor(loggerName: string) {
    super()
    this._loggerName = loggerName;
  }
  private getColorFunction(loggerName: string): string {
    switch (loggerName) {
      case 'info':
        return colors.white(loggerName);
      case 'warn':
        return colors.yellow(loggerName);
      case 'error':
        return colors.red(loggerName);
      default:
        return colors.blue(loggerName);
    }
  }
  public handle(settings: MessageSettings) {
    let coloredLogs: string;
    if (!settings.useLoggerName) {
      return
    }
    if (settings.displayTime) {
      const time = new Date().getTime();
      this._loggerName = this._loggerName + ' ' + time
    }
    if (settings.useColoredLogs) {
      this._loggerName = this.getColorFunction(this._loggerName + ':' + ' ')
    }
    AbstractLogHandler._loggerMessage = this._loggerName + AbstractLogHandler._loggerMessage;
    return super.handle(settings);
  }
}
export { WithLoggerName, WithLogger }

// const withLogger = new WithLogger('message')
// const withLoggerName = new WithLoggerName('error')
// const setting = {
//   displayConsoleLogs: true,
//   displayTelegramLogs: false,
//   displayTime: true,
//   useColoredLogs: true,
//   useLoggerName: true
// }

// withLogger.setNext(withLoggerName)
// withLogger.handle(setting)

// console.log(withLogger.loggerMessage)