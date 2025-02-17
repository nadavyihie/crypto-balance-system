import { Controller, Get, Param, Query } from '@nestjs/common';
import { RateService } from './rate.service';

@Controller('rates')
export class RateController {
  constructor(private readonly rateService: RateService) {}

  @Get()
  getCurrencyRates(@Query('currency') currency: string) {
    return this.rateService.getCurrencyRates(currency); 
  }
} 