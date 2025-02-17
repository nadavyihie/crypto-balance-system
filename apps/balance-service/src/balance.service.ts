import { BadRequestException, Injectable } from "@nestjs/common";
import { FileService } from "@app/shared/modules/file/file.service";
import { CustomLoggerService } from "@app/shared/modules/logging/logging.service";
import { Balance } from "@app/shared/interfaces/balance.interface";
import { Validator } from "@app/shared/validators/validator";
import axios from "axios";
import { error } from "console";
import { exec } from "child_process";

@Injectable()
export class BalanceService {
  private readonly BALANCES_FILE = "data/balances.json";
  private readonly RATE_SERVICE_URL = "http://localhost:3001/rates";
  constructor(
    private readonly fileService: FileService,
    private readonly logger: CustomLoggerService
  ) {}

  async getBalance(userId: string): Promise<Balance[]> {
    try {
      const balances = await this.fileService.readJson<Balance[]>(
        this.BALANCES_FILE
      );
      this.logger.log(`Retrieved balances for user ${userId}`);
      return balances.filter((balance) => balance.userId === userId);
    } catch (error) {
      this.logger.error(
        `Failed to get balance for user ${userId}`,
        error.stack
      );
      throw error;
    }
  }

  async deleteBalance(userId: string, asset: string): Promise<string> {
    try {
      const balances = await this.fileService.readJson<Balance[]>(
        this.BALANCES_FILE
      );
      const isAssetExistsInBalances = balances.some(
        (balance) => balance.asset === asset && balance.userId === userId
      );
      if (!isAssetExistsInBalances) {
        throw new BadRequestException(`Asset ${asset} not found in user ${userId} balances`);
      }
      const updatedBalances = balances.filter(
        (balance) => balance.userId !== userId || balance.asset !== asset
      );
      await this.fileService.writeJson(this.BALANCES_FILE, updatedBalances);
      this.logger.log(`Deleted balance for user ${userId}, asset ${asset}`);
      return `Successfully deleted balance for user ${userId}, asset ${asset}`;
    } catch (error) {
      this.logger.error(
        `Failed to delete balance for user ${userId}, asset ${asset}`,
        error.stack
      );
      throw error;
    }
  }

  async addBalance(
    userId: string,
    asset: string,
    amount: number
  ): Promise<string> {
    try {
      Validator.validateAsset(asset);
      Validator.validateAmount(amount);
      const balances = await this.fileService.readJson<Balance[]>(
        'bla'
      );
      const existingBalance = balances.find(
        (b) => b.userId === userId && b.asset === asset
      );

      if (existingBalance) {
        existingBalance.amount += amount;
        this.logger.log(`Updated balance for user ${userId}, asset ${asset}`);
      } else {
        balances.push({ userId, asset, amount });
        this.logger.log(`Added new balance for user ${userId}, asset ${asset}`);
      }

      await this.fileService.writeJson('data/balances.json', balances);
      return `Successfully added balance for user ${userId}, asset ${asset}`;
    } catch (error) {
      this.logger.error(
        `Failed to add balance for user ${userId}`,
        error.stack
      );
      throw error;
    }
  }

  async getTotalBalancesValue(
    userId: string,
    currency: string
  ): Promise<string> {
    try {
      Validator.validateCurrency(currency);
      const balances: Balance[] = await this.getBalance(userId);
      const currencyRates: Record<string, number> = await axios.get(
        this.RATE_SERVICE_URL,
        {
          params: { currency },
        }
      );
      const totalValue = balances.reduce((total, balance) => {
        const rate = currencyRates.data[balance.asset];
        return total + balance.amount * rate;
      }, 0);
      return `Total value: ${totalValue.toFixed(2)}${this.getCurrencyIcon(
        currency
      )}`;
    } catch (error) {
      this.logger.error(
        `Failed to get total balances value for user ${userId}`,
        error.stack
      );
      throw error;
    }
  }

  getCurrencyIcon(currency: string): string {
    switch (currency) {
      case "usd":
        return "$";
      case "eur":
        return "€";
      case "gbp":
        return "£";
      case "ils":
        return "₪";
      default:
        return currency;
    }
  }

  async rebalance(
    userId: string,
    targetPercentages: { asset: string; percentage: number }[]
  ): Promise<string> {
    try {
        targetPercentages.forEach(target => {
            Validator.validateAsset(target.asset)
        })
      const totalPercentage = targetPercentages.reduce((sum, target) => sum + target.percentage, 0);
      if (totalPercentage !== 100) {
        throw new BadRequestException('Total allocation must equal 100%');
      }

      const rates = await axios.get<Record<string, number>>(this.RATE_SERVICE_URL, {
        params: { currency: 'usd' }
      });
      const currentRates = rates.data;
      
      const currentBalances = await this.getBalance(userId);
      
      const totalValue = currentBalances.reduce((sum, balance) => {
        return sum + (balance.amount * currentRates[balance.asset]);
      }, 0);


      const newBalances = targetPercentages.map(target => ({
        userId,
        asset: target.asset,
        amount: (totalValue * (target.percentage / 100)) / currentRates[target.asset]
      }));


      const allBalances = await this.fileService.readJson<Balance[]>(this.BALANCES_FILE);
      const otherUsersBalances = allBalances.filter(b => b.userId !== userId);
      await this.fileService.writeJson(this.BALANCES_FILE, [...otherUsersBalances, ...newBalances]);

      return `Rebalanced successfully for user ${userId}`;
    } catch (error) {
      this.logger.error(`Failed to rebalance portfolio for user ${userId}`, error.stack);
      throw error;
    }
  }
}
