//TODO: change Error type to ErrorLog or something else
export type ErrorType = 'info' | 'error' | 'debug'

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
  debug(message: string): void;
  info(message: string): void;
}

export type Settings = {
  displayConsoleLogs?: boolean;
  showErrorStackTrace?: boolean;
}

export type ChannelId = string; //2100966365
export type TopicId = number; //1
//https://t.me/c/2100966365/1 (example)
export type InviteLinkForTopic = `https://t.me/${string}/${string}`