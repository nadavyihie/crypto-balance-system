import { Injectable } from '@nestjs/common';
import { FileService } from '@app/shared/modules/file/file.service';
import { CustomLoggerService } from '@app/shared/modules/logging/logging.service';
import { Balance } from '@app/shared/interfaces/balance.interface';
import axios from 'axios';

@Injectable()
export class BalanceService {
  private readonly BALANCES_FILE = 'data/balances.json';

  constructor(
    private readonly fileService: FileService,
    private readonly logger: CustomLoggerService,
  ) {}

  async getBalance(userId: string): Promise<Balance[]> {
    try {
      const balances = await this.fileService.readJson<Balance[]>(this.BALANCES_FILE);
      this.logger.log(`Retrieved balances for user ${userId}`);
      return balances.filter((balance) => balance.userId === userId);
    } catch (error) {
      this.logger.error(`Failed to get balance for user ${userId}`, error.stack);
      throw error;
    }
  }

  async addBalance(userId: string, asset: string, amount: number): Promise<Balance> {
    try {
      const balances = await this.fileService.readJson<Balance[]>(this.BALANCES_FILE);
      const existingBalance = balances.find(
        (b) => b.userId === userId && b.asset === asset,
      );

      if (existingBalance) {
        existingBalance.amount += amount;
        this.logger.log(`Updated balance for user ${userId}, asset ${asset}`);
      } else {
        balances.push({ userId, asset, amount });
        this.logger.log(`Added new balance for user ${userId}, asset ${asset}`);
      }

      await this.fileService.writeJson(this.BALANCES_FILE, balances);
      return { userId, asset, amount };
    } catch (error) {
      this.logger.error(`Failed to add balance for user ${userId}`, error.stack);
      throw error;
    }
  }
} 