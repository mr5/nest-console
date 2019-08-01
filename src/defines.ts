import { INestApplication } from '@nestjs/common'

export interface Logger {
  debug(str: string | object): void

  debug(format: string, ...mixed: any[]): void

  info(str: string | object): void

  info(format: string, ...mixed: any[]): void

  log(str: string | object): void

  log(format: string, ...mixed: any[]): void

  warn(str: string | object): void

  warn(format: string, ...mixed: any[]): void

  error(str: string | object): void

  error(format: string, ...mixed: any[]): void
}

export interface ConsoleRunOptions {
  app: INestApplication
  name: string
  version: string
  logger?: Logger
  args?: string[]
  callback?: (err?: Error) => void
}
