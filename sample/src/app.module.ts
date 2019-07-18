import { Module } from '@nestjs/common'
import { Commands, ConsoleModule } from 'nest-console'
import { ExtendedCommand } from './extended.command'
import { HelloCommand } from './hello.command'

@Module({
  imports: [ConsoleModule],
})
@Commands([ExtendedCommand, HelloCommand])
export class ApplicationModule {}
