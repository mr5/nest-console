import { NestFactory } from '@nestjs/core'
import { ConsoleService, ConsoleModule } from 'nest-console'
import { ApplicationModule } from './app.module'
;(async () => {
  const app = await NestFactory.create(ApplicationModule, { logger: false })
  app
    .select(ConsoleModule)
    .get(ConsoleService)
    .run({
      app,
      name: 'nest-console sample',
      version: 'v1.0.0',
      callback: (err) => {
        console.error(err)
      },
    })
})()

process.on('unhandledRejection', (reason, promise) => {
  promise
    .then((value) => {
      console.log('promise then', value)
    })
    .catch((e) => {
      console.error('promise catch', e)
    })
  console.error('unhandledRejection', { reason, promise })
})

process.on('uncaughtException', (e) => {
  console.error('uncaughtException', e)
})
