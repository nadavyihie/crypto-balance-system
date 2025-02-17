# Crypto Balance System

A microservices-based cryptocurrency portfolio management system that allows users to track, manage, and rebalance their crypto assets across multiple currencies.

## Features

- Real-time cryptocurrency rate tracking via CoinGecko API
- Portfolio balance management
- Multi-currency support (USD, EUR, GBP, ILS)
- Automated portfolio rebalancing
- Persistent storage of rates and balances
- Comprehensive logging system

## Services

### Rate Service (default port 3001)
- Fetches and stores current cryptocurrency rates
- Updates rates every 5 minutes
- Supports multiple base currencies
- Endpoints:
  - `GET /rates?currency={currency}` - Get current rates for specified currency

### Balance Service (default port 3000)
- Manages user cryptocurrency balances
- Supports adding and removing assets
- Portfolio rebalancing functionality
- Endpoints:
  - `GET /balances` - Get user's balances
  - `POST /balances` - Add balance
  - `DELETE /balances?asset={asset}` - Delete balance
  - `GET /balances/total?currency={currency}` - Get total portfolio value
  - `POST /balances/rebalance` - Rebalance portfolio

## Supported Assets
- Bitcoin (BTC)
- Ethereum (ETH)
- Cardano (ADA)
- Polkadot (DOT)
- Dogecoin (DOGE)
- Tether (USDT)

### Quick Start

1. Clone and install
   ```bash
   git clone https://github.com/nadavyihie/crypto-balance-system.git
   cd crypto-balance-system
    
   # Install NestJS CLI globally
   npm install -g @nestjs/cli

   # Install dependencies
   npm install
   ```

2. Set up environment
   
   edit `.env` file in rate-service:
   ```bash
   COINGECKO_API_KEY=YOUR_API_KEY
   PORT=PORT_NUMBER_1
   ```

   edit `.env` file in balance-service:
   ```bash
   PORT=PORT_NUMBER_2
   ```

3. Start services
   ```bash
   # Terminal 1: Start Rate Service
   nest start rate-service

   # Terminal 2: Start Balance Service
   nest start balance-service
   ```

### API Examples

Get current rates:
```bash
curl http://localhost:3001/rates?currency=usd
```

Add balance:
```bash
curl -X POST http://localhost:3000/balances \
  -H "X-User-ID: 1" \
  -H "Content-Type: application/json" \
  -d '{"asset": "bitcoin", "amount": 1.5}'
```