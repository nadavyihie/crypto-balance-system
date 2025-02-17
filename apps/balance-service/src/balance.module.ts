import { Module } from '@nestjs/common';
import { BalanceController } from './balance.controller';
import { BalanceService } from './balance.service';
import { SharedModule } from '@app/shared';

@Module({
  imports: [SharedModule],
  controllers: [BalanceController],
  providers: [BalanceService],
})
export class BalanceModule {} 