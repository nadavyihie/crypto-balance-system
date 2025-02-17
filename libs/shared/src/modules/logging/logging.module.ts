import { Module } from '@nestjs/common';
import { CustomLoggerService } from './logging.service';

@Module({
  providers: [CustomLoggerService],
  exports: [CustomLoggerService],
})
export class LoggingModule {} 