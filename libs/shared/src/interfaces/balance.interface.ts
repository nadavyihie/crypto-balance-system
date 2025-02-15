export interface Balance {
  userId: string;
  asset: string;
  amount: number;
}

export interface Rate {
  asset: string;
  price: number;
  lastUpdated: Date;
} 