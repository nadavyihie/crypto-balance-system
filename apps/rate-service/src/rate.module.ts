import { Module } from '@nestjs/common';
import { RateService } from './rate.service';
import { RateController } from './rate.controller';
import { SharedModule } from '@app/shared';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [SharedModule, ScheduleModule.forRoot()],
  controllers: [RateController],
  providers: [RateService],
})
export class RateModule {} 