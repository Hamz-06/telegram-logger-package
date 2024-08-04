import colors from 'colors';
import { MessageSettings } from '../types/messageSetting';
import { LogMessageHandler } from './logMessageHandler';
import { OptionalMessage } from '../types/logger';
import { extractErrorInfo } from '../helper/helper';

// https://refactoring.guru/design-patterns/chain-of-responsibility
// Create msg -> append logger name -> append stack trace

class CreateLoggerMessage extends LogMessageHandler {
  private readonly logMessage: string;

  constructor(startMessage: string) {
    super();
    this.logMessage = startMessage;
  }

  public handle(settings: MessageSettings) {
    LogMessageHandler._loggerMessage = this.logMessage;
    LogMessageHandler._defaultMessage = this.logMessage;
    super.handle(settings);
  }
}

class AppendLoggerName extends LogMessageHandler {
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

  private formatLoggerName(useColoredLogs: boolean, displayTime: boolean): string {
    let formattedLoggerName = this.loggerName;

    if (displayTime) {
      const time = new Date().toISOString();
      formattedLoggerName += ` ${time}`;
    }

    if (useColoredLogs) {
      formattedLoggerName = this.getColorFunction()(formattedLoggerName);
    }

    return formattedLoggerName;
  }

  public handle(settings: MessageSettings) {
    if (settings.useLoggerName) {
      const loggerName = this.formatLoggerName(settings.useColoredLogs, settings.displayTime);
      const colon = settings.useColoredLogs ? this.getColorFunction()(':') : ':';

      LogMessageHandler._loggerMessage = `${loggerName}${colon} ${LogMessageHandler._loggerMessage}`;
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
      // Stack trace contains this info
      errorMessage = `${name}: ${message}`;
    }

    if (settings.displayAdditionalInfoError) {
      errorMessage += `ADDITIONAL_INFO: \n${additionalInfo}`;
    }
    errorMessage = colors.italic.dim(errorMessage);
    LogMessageHandler._loggerMessage = `${LogMessageHandler._loggerMessage} ${errorMessage}`;
    super.handle(settings);
  }
}

export { AppendLoggerName, AppendErrorStackTrace, CreateLoggerMessage };
