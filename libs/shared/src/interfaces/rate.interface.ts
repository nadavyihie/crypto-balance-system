export interface Rate {
  [currency: string]: number;
}

export interface RatesCollection {
  [asset: string]: Rate;
}
