import { SupportedCurrency } from '../enums/currency.enum';
import { SupportedAsset } from '../enums/asset.enum';
import { BadRequestException } from '@nestjs/common';

export class Validator {
  static validateCurrency(currency: string): void {
    if (!Object.values(SupportedCurrency).includes(currency as SupportedCurrency)) {
      throw new BadRequestException(`Unsupported currency: ${currency}`);
    }
  }

  static validateAsset(asset: string): void {
    if (!Object.values(SupportedAsset).includes(asset as SupportedAsset)) {
      throw new BadRequestException(`Unsupported asset: ${asset}`);
    }
  } 

  static validateAmount(amount: number): void {
    if (isNaN(amount) || amount <= 0) {
      throw new BadRequestException(`Invalid amount: ${amount}`);
    }
  }
} 