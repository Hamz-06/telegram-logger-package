import { Settings } from "./logger"

export type MessageSettings = Pick<Settings, 'displayConsoleLogs' | 'showErrorStackTrace'> 