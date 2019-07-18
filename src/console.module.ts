import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { MetadataScanner } from '@nestjs/core/metadata-scanner'
import { ConsoleService } from './console.service'

@Module({
  providers: [MetadataScanner, ConsoleService],
  exports: [ConsoleService],
})
export class ConsoleModule {}
