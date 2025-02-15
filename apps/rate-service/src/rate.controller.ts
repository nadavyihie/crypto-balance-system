import { Controller, Get, Param } from '@nestjs/common';
import { RateService } from './rate.service';

@Controller('rates')
export class RateController {
  constructor(private readonly rateService: RateService) {}

  @Get(':asset')
  getRate(@Param('asset') asset: string) {
    return this.rateService.getRate(asset);
  }
} 