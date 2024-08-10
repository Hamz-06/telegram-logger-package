import { Settings } from './logger';

export type MessageSettings = Required<Pick<Settings,
  'displayConsoleLogs' | 'useColoredLogs' | 'displayTime' | 'useLoggerName'
  | 'displayTelegramLogs' | 'displayStackTraceError' | 'displayAdditionalInfoError'>>
