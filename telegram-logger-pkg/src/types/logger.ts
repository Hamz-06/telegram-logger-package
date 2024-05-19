//TODO: change Error type to ErrorLog or something else
export type ErrorType = 'info' | 'error' | 'warn'

//used by the user interface
export type ErrorInviteLinkMap = {
  [error in ErrorType]?: InviteLinkForTopic;
}
//Used internally
export type ErrorTopicMap = {
  [error in ErrorType]?: TopicId;
}

export interface ILoggerHandler {
  error(message: string): void;
  warn(message: string): void;
  info(message: string): void;
}

export type Settings = {
  displayLogs?: boolean;
  useColoredLogs?: boolean;
  displayStackTrace?: boolean;
}

/**
 * @example 2100966365
 * 
 */
export type ChannelId = string;

/**
 * @example 1
 * 
 */
export type TopicId = number;

/**
 * @example https://t.me/c/2100966365/1
 * 
 */
export type InviteLinkForTopic = `https://t.me/c/${string}/${string}`