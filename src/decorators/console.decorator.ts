import { Constructor } from '@nestjs/common/utils/merge-with-values.util'

export const META_CONSOLE = 'nest-console:console'
export const META_MODULE_COMMANDS = 'nest-console:module:commands'

export function Console(prefix?: string): ClassDecorator {
  return (target: object) => {
    Reflect.defineMetadata(META_CONSOLE, { prefix }, target)
  }
}

export function Commands(commandClasses: Array<Constructor<any>>) {
  return (target: Constructor<any>) => {
    Reflect.defineMetadata(META_MODULE_COMMANDS, commandClasses, target)
  }
}
