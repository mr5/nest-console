import { NestFactory } from '@nestjs/core'
import { ConsoleService, ConsoleModule } from 'nest-console'
import { ApplicationModule } from './app.module'
;(async () => {
  const app = await NestFactory.create(ApplicationModule, { logger: false })
  app
    .select(ConsoleModule)
    .get(ConsoleService)
    .run(app, 'nest-console sample', 'v1.0.0')
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
