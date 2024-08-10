// TODO: change Error type to ErrorLog or something else

export type DefaultLoggerName = 'info' | 'error' | 'warn'

// Used internally
export type ErrorTopicMap = {
  [loggerName: string]: TopicId
}

export interface ILoggerHandler<T> {
  logMessage(logType: T, message: string): void;
}
/**
 * Paramter that is passed into the constructor
 */
export type TelegramChannels<T extends string> = {
  [loggerName in T]: TelegramInviteLink;
};
/**
 * Optional settings for the message
 */
export type OptionalMessage = {
  error?: Error
}

export type Settings = {
  /**
   * Whether to display logs on Telegram. Default is `true`.
   */
  displayTelegramLogs?: boolean;

  /**
   * Whether to display logs in the console. Default is `true`.
   */
  displayConsoleLogs?: boolean;

  /**
   * Whether to use colored logs. Default is `false`.
   */
  useColoredLogs?: boolean;

  /**
   * Whether to display the time with logs. Default is `false`.
   */
  displayTime?: boolean;

  /**
   * Whether to use the logger name in the logs. Default is `true`.
   */
  useLoggerName?: boolean;

  /**
   * Display stack trace error messages. Default is `false`.
   */
  displayStackTraceError?: boolean

  /**
   *Display additionalInfo from error messages. Default is `false`.
   */
  displayAdditionalInfoError?:boolean

};

/**
 * @example 2100966365
 */
export type ChannelId = string;

/**
 * @example 1
 */
export type TopicId = number;

/**
 * @example https://t.me/c/2100966365/1
 */
export type TelegramInviteLink = `https://t.me/c/${number}/${TopicId}`
