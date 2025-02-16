import { Controller, Get, Post, Headers, Body, Delete, Query } from '@nestjs/common';
import { BalanceService } from './balance.service';

@Controller('balances')
export class BalanceController {
  constructor(private readonly balanceService: BalanceService) {}

  @Get()
  getBalance(@Headers('X-User-ID') userId: string) {
    return this.balanceService.getBalance(userId);
  }

  @Post()
  addBalance(
    @Headers('X-User-ID') userId: string,
    @Body() body: { asset: string; amount: number },
  ) {
    return this.balanceService.addBalance(userId, body.asset, body.amount);
  }

  @Delete()
  deleteBalance(
    @Headers('X-User-ID') userId: string,
    @Body() body: { asset: string },
  ) {
    return this.balanceService.deleteBalance(userId, body.asset);
  }

  @Get('total')
  getTotalBalancesValue(
    @Headers('X-User-ID') userId: string,
    @Query('currency') currency: string,
  ) {
    return this.balanceService.getTotalBalancesValue(userId, currency);
  }
} 