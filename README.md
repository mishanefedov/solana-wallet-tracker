# Solana Wallet Tracker

NOTE: this readme was AI generated!

A Node.js application that monitors multiple Solana wallets for new transactions and sends real-time notifications via Telegram.

## Features

- Monitor multiple Solana wallets simultaneously
- Real-time transaction detection
- Telegram notifications with transaction details
- Automatic retry and error handling
- Configurable monitoring intervals

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- A Telegram bot token
- Solana RPC endpoint access

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd solana-wallet-tracker
```

2. Install dependencies:
```bash
npm install
```

## Configuration

### 1. Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_CHAT_ID=your_telegram_chat_id
```

**Environment Variable Details:**

- `SOLANA_RPC_URL`: Solana RPC endpoint URL (you can use public endpoints or services like Helius, QuickNode, etc.)
- `TELEGRAM_BOT_TOKEN`: Your Telegram bot token (get it from @BotFather)
- `TELEGRAM_CHAT_ID`: The chat ID where notifications will be sent

### 2. Wallet Configuration

Create a `wallets.json` file in the root directory with the wallets you want to monitor:

```json
{
  "Wallet1": "wallet_address_1",
  "Wallet2": "wallet_address_2",
  "MyWallet": "your_wallet_address_here"
}
```

The format is:
```json
{
  "friendly_name": "actual_solana_wallet_address"
}
```

## Setting Up Telegram Bot

1. Open Telegram and search for @BotFather
2. Send `/newbot` command
3. Follow the instructions to create your bot
4. Copy the bot token and add it to your `.env` file
5. To get your chat ID:
   - Send a message to your bot
   - Visit: `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
   - Find your chat ID in the response and add it to your `.env` file

## Usage

### Start Monitoring

```bash
npm start
```

Or directly with Node.js:
```bash
node src/index.js
```

### What Happens

1. The script loads wallet addresses from `wallets.json`
2. It starts monitoring each wallet for new transactions
3. When a new transaction is detected, it sends a Telegram message with:
   - Transaction timestamp
   - Wallet address and friendly name
   - Link to view the wallet on Solscan

### Sample Notification

```
Tx time: [2024-01-15T10:30:45.000Z], wallet: 7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU (MyWallet)

https://solscan.io/account/7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU
```

## How It Works

- **Staggered Monitoring**: Each wallet monitoring starts with a 10-second delay to distribute API calls
- **Polling Interval**: Checks for new transactions every `10 seconds × number of wallets`
- **Transaction Detection**: Compares the latest transaction signature with the previous one
- **Error Handling**: Continues monitoring even if individual requests fail

## File Structure

```
solana-wallet-tracker/
├── src/
│   ├── index.js          # Entry point
│   └── monitor.js        # Main monitoring logic
├── package.json          # Dependencies and scripts
├── wallets.json          # Wallet configuration (create this)
├── .env                  # Environment variables (create this)
└── README.md            # This file
```

## Troubleshooting

### Common Issues

1. **"Cannot read property" errors**: Make sure `wallets.json` exists and is properly formatted
2. **RPC errors**: Check your `SOLANA_RPC_URL` - public endpoints may have rate limits
3. **Telegram not working**: Verify your bot token and chat ID are correct
4. **No notifications**: Check console output for errors and ensure wallets have recent activity

### Rate Limiting

- Consider using premium RPC providers (Helius, QuickNode) for better rate limits
- Adjust monitoring intervals if you encounter rate limiting issues

## Contributing

Feel free to submit issues and enhancement requests!

## License

ISC License
