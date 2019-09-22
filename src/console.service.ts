import { INestApplication, Injectable } from '@nestjs/common'
import { ModulesContainer } from '@nestjs/core/injector'
import { MetadataScanner } from '@nestjs/core/metadata-scanner'
import * as caporal from 'caporal'
import { sortBy, get } from 'lodash'
import {
  META_CONSOLE,
  META_MODULE_COMMANDS,
  META_COMMAND,
  META_COMMAND_ARGUMENTS,
  META_COMMAND_OPTIONS,
} from './decorators'
import { Constructor } from '@nestjs/common/utils/merge-with-values.util'
import { Module } from '@nestjs/core/injector/module'
import { Injector } from '@nestjs/core/injector/injector'
import { ConsoleRunOptions } from './defines'

@Injectable()
export class ConsoleService {
  private readonly instanceLoader = new Injector()
  private callback?: Function

  constructor(private readonly modulesContainer: ModulesContainer, private readonly metadataScanner: MetadataScanner) {}

  run(options: ConsoleRunOptions) {
    const { app, name, version = 'v0.1.0', logger = console, args = process.argv, callback } = options
    this.callback = callback
    caporal
      .name(name)
      .version(version)
      .logger(logger)
    this.modulesContainer.forEach((module) => {
      const commands = Reflect.getMetadata(META_MODULE_COMMANDS, module.metatype)
      if (!commands) {
        return
      }
      commands.map((component: Constructor<any>) => {
        Injectable()(component)
        module.addInjectable(component)
        this.addCommand(app, caporal, component, module)
      })
    })
    caporal.parse(args)
  }
  runP(options: Omit<ConsoleRunOptions, 'callback'>) {
    return new Promise((resolve) => {
      this.run(Object.assign(options, { callback: resolve }))
    })
  }
  addCommand(app: INestApplication, prog: Caporal, commandClass: Constructor<any>, module: Module) {
    const consoleMeta = Reflect.getMetadata(META_CONSOLE, commandClass)

    if (!consoleMeta) {
      return prog
    }

    const prefix = consoleMeta.prefix ? `${consoleMeta.prefix}:` : ''

    this.metadataScanner.scanFromPrototype(commandClass, commandClass.prototype, (method) => {
      const commandMeta = Reflect.getMetadata(META_COMMAND, commandClass, method)
      if (!commandMeta) {
        return
      }
      const command = prog.command(`${prefix}${commandMeta.name}`, commandMeta.description)
      if (commandMeta.alias) {
        command.alias(commandMeta.alias)
      }

      const argumentsMeta = Reflect.getMetadata(META_COMMAND_ARGUMENTS, commandClass, method)
      const argsInfo: Array<{ path: string[]; parameterIndex: number }> = []
      if (argumentsMeta) {
        for (const argumentMeta of sortBy(argumentsMeta, 'parameterIndex')) {
          argsInfo.push({
            path: ['args', argumentMeta.name],
            parameterIndex: argumentMeta.parameterIndex,
          })
          command.argument(argumentMeta.name, argumentMeta.description, undefined, argumentMeta.defaultValue)
        }
      }

      const optionsMeta = Reflect.getMetadata(META_COMMAND_OPTIONS, commandClass, method)
      if (optionsMeta) {
        for (const optionMeta of sortBy(optionsMeta, 'parameterIndex')) {
          argsInfo.push({
            path: ['options', optionMeta.name],
            parameterIndex: optionMeta.parameterIndex,
          })
          command.option(
            `--${optionMeta.name}`,
            optionMeta.description,
            undefined,
            optionMeta.defaultValue,
            optionMeta.required
          )
        }
      }

      command.action(async (args, options, logger) => {
        try {
          const injectable = module.injectables.get(commandClass.name)
          if (!injectable) {
            throw new Error(`Can not get injectable: ${commandClass.name}`)
          }
          this.instanceLoader.loadPrototype(injectable, module.injectables)
          await this.instanceLoader.loadInjectable(injectable, module)
          const commandInstance = app.get(commandClass)
          const methodArgs = []
          const params = { args, options }
          for (const argInfo of sortBy(argsInfo, 'parameterIndex')) {
            methodArgs.push(get(params, argInfo.path))
          }
          methodArgs.push(logger)
          await commandInstance[method].apply(commandInstance, methodArgs)
          if (this.callback) {
            this.callback()
          }
        } catch (e) {
          if (this.callback) {
            this.callback(e)
          } else {
            throw e
          }
        }
      })
    })
    return prog
  }
}
