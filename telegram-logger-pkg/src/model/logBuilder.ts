import colors from 'colors';
import { MessageSettings } from '../types/messageSetting';
import { LogMessageHandler } from './logMessageHandler';
import { OptionalMessage } from '../types/logger';
import { extractErrorInfo } from '../helper/helper';

// https://refactoring.guru/design-patterns/chain-of-responsibility
// logger name -> logger date -> append color -> append message -> append error -> trim error

class AppendLoggerName extends LogMessageHandler {
  private readonly loggerName: string;
  constructor(loggerName: string) {
    super();
    this.loggerName = loggerName;
  }
  public handle(settings: MessageSettings): void {
    const { useLoggerName } = settings;

    if (useLoggerName) {
      this.pushMessage(`${this.loggerName}::`);
    }
    super.handle(settings);
  }
}

class AppendDate extends LogMessageHandler {
  private appendDate():string {
    return new Date().toISOString();
  }

  public handle(settings: MessageSettings) {
    const { displayTime } = settings;

    if (displayTime) {
      const dateStr = this.appendDate();
      this.pushMessage(dateStr);
    }
    super.handle(settings);
  }
}

class AppendMessage extends LogMessageHandler {
  private readonly message: string;
  constructor(defaultMessage: string) {
    super();
    this.message = defaultMessage;
  }

  public handle(settings: MessageSettings): void {
    this.pushMessage(` ${this.message}`);
    super.handle(settings);
  }
}

class AppendColor extends LogMessageHandler {
  private readonly loggerName: string;

  constructor(loggerName: string) {
    super();
    this.loggerName = loggerName;
  }
  public handle(settings: MessageSettings): void {
    const { useColoredLogs } = settings;

    if (useColoredLogs) {
      const coloredLogger = this.getColorFunction()(this.consoleMessage);
      this.updateMessage(coloredLogger);
    }
    super.handle(settings);
  }
  private getColorFunction(): (str: string) => string {
    switch (this.loggerName) {
    case 'info':
      return colors.white;
    case 'warn':
      return colors.yellow;
    case 'error':
      return colors.red;
    default:
      return colors.blue;
    }
  }
}

class AppendErrorStackTrace extends LogMessageHandler {
  private optionalMessage : OptionalMessage | undefined;
  constructor(optionalMessage?: OptionalMessage) {
    super();
    this.optionalMessage = optionalMessage;
  }

  public handle(settings: MessageSettings): void {
    let errorMessage = '';
    const error = this.optionalMessage?.error;
    if (!error) return;

    const { additionalInfo, message, name, stack } = extractErrorInfo(error);

    if (settings.displayStackTraceError) {
      errorMessage += `\nSTACK TRACE: \n${stack}`;
    } else {
      // Stack trace contains the error name and message
      errorMessage = `${name}: ${message}`;
    }

    if (settings.displayAdditionalInfoError) {
      errorMessage += `ADDITIONAL_INFO: \n${additionalInfo}`;
    }

    const updatedLogMessage = `\n ${colors.italic.dim(errorMessage)}`;

    this.pushMessage(updatedLogMessage);
    super.handle(settings);
  }
}

class TrimMessage extends LogMessageHandler {
  public handle(settings: MessageSettings): void {
    const trimmedMessage = this.consoleMessage.trim();
    this.updateMessage(trimmedMessage);
    super.handle(settings);
  }
}

export { AppendDate, AppendErrorStackTrace, AppendColor,
  AppendLoggerName, AppendMessage, TrimMessage };
