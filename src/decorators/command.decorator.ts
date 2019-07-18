import { DuplicatedArgumentDefinitionException, DuplicatedOptionDefinitionException } from '../exceptions'

export const META_COMMAND = Symbol('Command')
export const META_COMMAND_OPTIONS = Symbol('CommandOptions')
export const META_COMMAND_ARGUMENTS = Symbol('CommandArguments')

export function Command(name: string, description?: string, alias?: string): MethodDecorator {
  return (target: object, key: any, descriptor: PropertyDescriptor) => {
    Reflect.defineMetadata(META_COMMAND, { name, description, alias }, target.constructor, descriptor.value.name)
    return descriptor
  }
}

export interface OptionMetaInfo {
  name: string
  description: string
  defaultValue?: any
  required?: boolean
  parameterIndex: number
}

export function Option(name: string, description: string, defaultValue?: any, required = false): ParameterDecorator {
  return (target: Object, propertyKey: string | symbol, parameterIndex: number) => {
    const options = Reflect.getMetadata(META_COMMAND_OPTIONS, target) || []
    if (options.length > 0 && options.filter((option: OptionMetaInfo) => option.name === name).length > 0) {
      throw new DuplicatedOptionDefinitionException()
    }
    options.push({
      name,
      description,
      defaultValue,
      required,
      parameterIndex,
    })
    return Reflect.defineMetadata(META_COMMAND_OPTIONS, options, target.constructor, propertyKey)
  }
}

export interface ArgumentMetaInfo {
  name: string
  description: string
  defaultValue?: any
  required?: boolean
  parameterIndex: number
}

export function Argument(name: string, description: string, defaultValue?: any): ParameterDecorator {
  return (target: Object, propertyKey: string | symbol, parameterIndex: number) => {
    const consoleArguments = Reflect.getMetadata(META_COMMAND_ARGUMENTS, target.constructor, propertyKey) || []
    if (
      consoleArguments.length > 0 &&
      consoleArguments.filter((argument: ArgumentMetaInfo) => argument.name === name).length > 0
    ) {
      throw new DuplicatedArgumentDefinitionException()
    }
    consoleArguments.push({
      name,
      description,
      defaultValue,
      parameterIndex,
    })
    return Reflect.defineMetadata(META_COMMAND_ARGUMENTS, consoleArguments, target.constructor, propertyKey)
  }
}
