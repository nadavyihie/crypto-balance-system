import { Injectable, OnModuleInit } from "@nestjs/common";
import { FileService } from "@app/shared/modules/file/file.service";
import { CustomLoggerService } from "@app/shared/modules/logging/logging.service";
import axios from "axios";
import { Cron } from "@nestjs/schedule";
import { RatesCollection } from "@app/shared/interfaces/rate.interface";
import { SupportedAsset, SupportedCurrency } from "@app/shared/enums";
import { Validator } from "@app/shared/validators/validator";

@Injectable()
export class RateService implements OnModuleInit {
  private readonly ASSETS = Object.values(SupportedAsset);
  private readonly CURRENCIES = Object.values(SupportedCurrency);
  private readonly RATES_FILE = "data/rates.json";
  private readonly COINGECKO_API_URL =
    "https://api.coingecko.com/api/v3/simple/price";
  private readonly API_KEY = process.env.COINGECKO_API_KEY;

  private rates: RatesCollection = {};

  constructor(
    private readonly fileService: FileService,
    private readonly logger: CustomLoggerService
  ) {}

  async onModuleInit() {
    this.logger.log("Initializing RateService");
    try {
      const savedRates = await this.fileService.readJson<RatesCollection>(
        this.RATES_FILE
      );
      if (savedRates) {
        this.rates = savedRates;
        this.logger.log("Loaded rates from file");
      }
    } catch (error) {
      this.logger.warn("No existing rates file found");
    }
  }

  @Cron("*/5 * * * *")
  async updateRates() {
    try {
      this.logger.log("Updating cryptocurrency rates");
      const response = await axios.get<RatesCollection>(
        this.COINGECKO_API_URL,
        {
          headers: {
            "x-cg-pro-api-key": this.API_KEY,
          },
          params: {
            ids: this.ASSETS.join(","),
            vs_currencies: this.CURRENCIES.join(","),
          },
        }
      );
      this.rates = response.data;

      await this.fileService.writeJson(this.RATES_FILE, this.rates);
      this.logger.log("Rates updated successfully");
    } catch (error) {
      this.logger.error("Failed to update rates:", error.stack);
    }
  }

  async getCurrencyRates(currency: string): Promise<Record<string, number>> {
    try {
      Validator.validateCurrency(currency);
      const ratesByCurrency: Record<string, number> = {};
      for (const asset of this.ASSETS) {
        ratesByCurrency[asset] = this.rates[asset][currency];
      }
      return ratesByCurrency;
    } catch (error) {
      this.logger.error("Failed to get currency rates:", error.stack);
      throw error;
    }
  }
}
