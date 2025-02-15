import { Module } from '@nestjs/common';
import { FileModule } from './modules/file/file.module';
import { LoggingModule } from './modules/logging/logging.module';

@Module({
  imports: [FileModule, LoggingModule],
  exports: [FileModule, LoggingModule],
})
export class SharedModule {}
