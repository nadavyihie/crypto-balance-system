import { Injectable } from "@nestjs/common";
import { FileService } from "@app/shared/modules/file/file.service";
import { CustomLoggerService } from "@app/shared/modules/logging/logging.service";
import { Balance } from "@app/shared/interfaces/balance.interface";
import axios from "axios";

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
      const balances = await this.fileService.readJson<Balance[]>(
        this.BALANCES_FILE
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

      await this.fileService.writeJson(this.BALANCES_FILE, balances);
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
}
