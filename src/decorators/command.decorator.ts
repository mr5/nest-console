import { DuplicatedArgumentDefinitionException, DuplicatedOptionDefinitionException } from '../exceptions'

export const META_COMMAND = 'nest-console:command'
export const META_COMMAND_OPTIONS = 'nest-console:command:options'
export const META_COMMAND_ARGUMENTS = 'nest-console:command:arguments'

export function Command(name: string, description?: string, alias?: string): MethodDecorator {
  return (target: {}, key: any, descriptor: PropertyDescriptor) => {
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
  return (target: {}, propertyKey: string | symbol, parameterIndex: number) => {
    const options = Reflect.getMetadata(META_COMMAND_OPTIONS, target.constructor, propertyKey) || []
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
  return (target: {}, propertyKey: string | symbol, parameterIndex: number) => {
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
