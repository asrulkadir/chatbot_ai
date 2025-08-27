# AI Telegram Chatbot with ChatGPT Integration

A sophisticated Telegram bot integrated with ChatGPT, featuring weather services and workout reminders, built with Node.js and TypeScript using a clean service-based architecture.

## 🚀 Features

- ✅ Full ChatGPT integration with conversation history
- ✅ AI mode on/off functionality with trigger commands
- ✅ Real-time weather information (OpenWeatherMap API)
- ✅ Smart workout recommendations based on weather conditions
- ✅ Automated weekend workout reminders with weather checking
- ✅ Clean modular service-based architecture
- ✅ Robust error handling and logging
- ✅ TypeScript for type safety
- ✅ **Automatic language detection** - Supports both Indonesian and English languages with smart detection

## 📋 Prerequisites

1. **Node.js** (version 16 or higher)
2. **npm** or **yarn**
3. **Telegram Bot Token** - Get from [@BotFather](https://t.me/botfather)
4. **OpenAI API Key** - Get from [OpenAI Platform](https://platform.openai.com/api-keys)
5. **OpenWeatherMap API Key** (Optional) - Get from [OpenWeatherMap](https://openweathermap.org/api)

## 🛠️ Installation

1. Clone this repository:
   ```bash
   git clone <repository-url>
   cd ai-chatbot-telegram
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy environment file:
   ```bash
   cp .env.example .env
   ```

4. Edit `.env` file with your API keys:
   ```env
   # Required
   TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
   OPENAI_API_KEY=your_openai_api_key_here
   
   # Optional ChatGPT Configuration
   OPENAI_MODEL=gpt-4
   MAX_TOKENS=1000
   TEMPERATURE=0.7
   
   # Optional Weather Service
   OPENWEATHER_API_KEY=your_openweather_api_key_here
   CITY_NAME=Jakarta
   COUNTRY_CODE=ID
   
   # Optional Workout Reminder
   REMINDER_USER_ID=your_telegram_user_id_here
   REMINDER_TIME=08:00
   REMINDER_TIMEZONE=Asia/Jakarta
   ```

## 🎯 How to Get API Keys

### Telegram Bot Token

1. Open Telegram and search for [@BotFather](https://t.me/botfather)
2. Send command `/newbot`
3. Follow instructions to name your bot
4. Copy the token and add it to `.env` file

### OpenAI API Key

1. Visit [OpenAI Platform](https://platform.openai.com/)
2. Register or login to your account
3. Go to [API Keys](https://platform.openai.com/api-keys) page
4. Click "Create new secret key"
5. Copy the API key and add it to `.env` file

### OpenWeatherMap API Key (Optional)

1. Visit [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for a free account
3. Go to API keys section
4. Copy your API key and add it to `.env` file

## 🚀 Running the Bot

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm run build
npm start
```

## 📱 Bot Commands

### Basic Commands
- `/start` - Start conversation with the bot
- `/help` - Show help and available commands
- `/clear` - Clear conversation history

### AI Mode Commands
- `/ai` - Enable AI ChatGPT mode
- `/ai_off` - Disable AI ChatGPT mode

### Weather & Workout Commands
- `/weather` - Get current weather information
- `/workout` - Get weather-based workout recommendations
- `/reminder` - Enable weekend workout reminders
- `/stop_reminder` - Disable workout reminders

### Smart Features
- **Auto Weather Detection**: Ask about "weather", "cuaca", "temperature" to get automatic weather info
- **Auto Workout Detection**: Ask about "workout", "olahraga", "exercise" to get workout recommendations based on weather
- **AI Mode**: When enabled, all messages are processed by ChatGPT
- **Weather-based Reminders**: Automatic weekend reminders with weather checking

## 🛠️ Available Scripts

| Script | Description |
|--------|-----------|
| `npm run dev` | Run bot in development mode |
| `npm run build` | Compile TypeScript to JavaScript |
| `npm start` | Run bot in production mode |
| `npm run lint` | Check TypeScript without compiling |