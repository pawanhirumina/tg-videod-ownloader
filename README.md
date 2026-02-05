# Telegram Bot - Node.js

A simple and extensible Telegram bot built with Node.js using the `node-telegram-bot-api` library.

## Features

- ✅ Command handling (/start, /help, /echo, /joke, /info, /buttons)
- ✅ Interactive inline keyboards
- ✅ Callback query handling
- ✅ Text message responses
- ✅ Error handling
- ✅ Environment variable support

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- A Telegram account
- A Telegram bot token from [@BotFather](https://t.me/BotFather)

## Setup Instructions

### 1. Create Your Telegram Bot

1. Open Telegram and search for [@BotFather](https://t.me/BotFather)
2. Send `/newbot` command
3. Follow the instructions to choose a name and username for your bot
4. Copy the bot token that BotFather gives you (it looks like: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)

### 2. Install Dependencies

```bash
# Navigate to the project directory
cd telegram-bot

# Install dependencies
npm install
```

### 3. Configure Environment Variables

1. Copy the `.env.example` file to `.env`:
```bash
cp .env.example .env
```

2. Open `.env` and replace `your_bot_token_here` with your actual bot token:
```
TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz
```

### 4. Run the Bot

```bash
# Production mode
npm start

# Development mode (auto-restart on file changes)
npm run dev
```

You should see "Bot is running..." in the console.

## Available Commands

Once your bot is running, you can interact with it on Telegram:

- `/start` - Show welcome message with all commands
- `/help` - Get help information
- `/echo <text>` - Bot will echo back your message
- `/joke` - Get a random programming joke
- `/info` - Display your chat information
- `/buttons` - Show interactive inline keyboard buttons

## Project Structure

```
telegram-bot/
├── bot.js              # Main bot logic
├── package.json        # Project dependencies and scripts
├── .env.example        # Environment variables template
├── .env               # Your actual environment variables (not in git)
├── .gitignore         # Git ignore rules
└── README.md          # This file
```

## Extending the Bot

### Adding New Commands

To add a new command, add this to `bot.js`:

```javascript
bot.onText(/\/mycommand/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Response to your command!');
});
```

### Adding Inline Keyboards

```javascript
const opts = {
  reply_markup: {
    inline_keyboard: [
      [
        { text: 'Button 1', callback_data: 'btn1' },
        { text: 'Button 2', callback_data: 'btn2' }
      ]
    ]
  }
};

bot.sendMessage(chatId, 'Choose an option:', opts);
```

### Handling File Uploads

```javascript
bot.on('photo', (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Thanks for the photo!');
});
```

## Common Issues

### Bot doesn't respond
- Make sure the bot is running (check console for "Bot is running...")
- Verify your bot token is correct in the `.env` file
- Check that you're messaging the correct bot on Telegram

### Polling errors
- Only one instance of the bot can run at a time
- Make sure no other process is using the same bot token

### Module not found errors
- Run `npm install` to install all dependencies

## Resources

- [node-telegram-bot-api Documentation](https://github.com/yagop/node-telegram-bot-api)
- [Telegram Bot API Documentation](https://core.telegram.org/bots/api)
- [BotFather Commands](https://core.telegram.org/bots/features#botfather)

## License

MIT

## Contributing

Feel free to submit issues and enhancement requests!
