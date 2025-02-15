import { Injectable, OnModuleInit } from '@nestjs/common';
import { FileService } from '@app/shared/modules/file/file.service';
import { CustomLoggerService } from '@app/shared/modules/logging/logging.service';
import axios from 'axios';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class RateService implements OnModuleInit {
  private rates: Map<string, Map<string, number>> = new Map();
  private readonly RATES_FILE = 'data/rates.json';

  constructor(
    private readonly fileService: FileService,
    private readonly logger: CustomLoggerService,
  ) {}

  async onModuleInit() {
    this.logger.log('Initializing RateService');
    try {
      // Load rates from file if it exists
      const savedRates = await this.fileService.readJson(this.RATES_FILE);
      if (savedRates) {
        // Convert nested object structure to nested Maps
        this.rates = new Map(
          Object.entries(savedRates).map(([crypto, rates]) => [
            crypto,
            new Map(Object.entries(rates as Record<string, number>))
          ])
        );
        this.logger.log('Loaded rates from file');
      }
    } catch (error) {
      this.logger.warn('No existing rates file found');
    }
  }
  async getRate(asset: string): Promise<Map<string, number>> {
    return this.rates.get(asset)
  }
} 