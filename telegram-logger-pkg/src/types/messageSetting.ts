import { Settings } from "./logger"

export type MessageSettings = Pick<Settings, 'displayLogs' | 'useColoredLogs' | 'displayStackTrace'> 