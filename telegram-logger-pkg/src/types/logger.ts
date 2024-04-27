type ErrorType = 'info' | 'error' | 'warning'

type AllTopic = {
  [error in ErrorType]: string;
}
export interface ILoggerHandler {
  error(message: string): void;
  debug(message: string): void;
  info(message: string): void;
}

export type Settings = {
  topics?: AllTopic;
}