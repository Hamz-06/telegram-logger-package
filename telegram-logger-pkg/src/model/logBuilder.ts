import colors from 'colors';
import { MessageSettings } from '../types/messageSetting';
import { LogMessageHandler } from './logMessageHandler';
import { OptionalMessage } from '../types/logger';
import { extractErrorInfo } from '../helper/helper';

// https://refactoring.guru/design-patterns/chain-of-responsibility
// logger name -> logger date -> append color -> append message -> append error


class AppendLoggerName extends LogMessageHandler {
  private readonly loggerName: string;
  constructor(loggerName: string) {
    super();
    this.loggerName = loggerName;
  }
  public handle(settings: MessageSettings): void {
    const { useLoggerName } = settings;

    if (useLoggerName) {
      this.updateConsoleLogMessage(`${this.loggerName}::`);
      this.updateTelegramLogMessage(`${this.loggerName}::`);
    }
    super.handle(settings);
  }
}


class AppendLoggerDate extends LogMessageHandler {
  private appendDate():string {
    return new Date().toISOString();
  }

  public handle(settings: MessageSettings) {
    const { displayTime } = settings;

    if (displayTime) {
      const date= this.appendDate();
      this.updateConsoleLogMessage(`${this.consoleLogMessage}${date}`);
      this.updateTelegramLogMessage(`${this.telegramLogMessage}${date}`);
    }
    super.handle(settings);
  }
}

class AppendLoggerMessage extends LogMessageHandler {
  private readonly message: string;
  constructor(defaultMessage: string) {
    super();
    this.message = defaultMessage;
  }
  public handle(settings: MessageSettings): void {
    this.updateConsoleLogMessage(`${this.consoleLogMessage} ${this.message}`);
    this.updateTelegramLogMessage(`${this.telegramLogMessage} ${this.message}`);
    super.handle(settings);
  }
}
class AppendColor extends LogMessageHandler {
  private readonly loggerName: string;

  constructor(loggerName: string) {
    super();
    this.loggerName = loggerName;
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
  public handle(settings: MessageSettings): void {
    const { useColoredLogs } = settings;

    if (useColoredLogs) {
      const coloredLogger = this.getColorFunction()(this.consoleLogMessage);
      this.updateConsoleLogMessage(coloredLogger);
    }

    super.handle(settings);
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

    const updatedLogMessage = `${this.consoleLogMessage} \n ${colors.italic.dim(errorMessage)}`;
    const updatedTelegramMessage = `${this.telegramLogMessage} \n ${errorMessage}`;

    this.updateConsoleLogMessage(updatedLogMessage);
    this.updateTelegramLogMessage(updatedTelegramMessage);

    super.handle(settings);
  }
}

export { AppendLoggerDate, AppendErrorStackTrace, AppendColor,
  AppendLoggerName, AppendLoggerMessage };
