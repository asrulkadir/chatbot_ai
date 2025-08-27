import type { BotConfig } from './types';

export function loadConfig(): BotConfig {
  const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
  const openaiApiKey = process.env.OPENAI_API_KEY;

  if (!telegramToken) {
    throw new Error('TELEGRAM_BOT_TOKEN tidak ditemukan di file .env');
  }

  if (!openaiApiKey) {
    throw new Error('OPENAI_API_KEY tidak ditemukan di file .env');
  }

  return {
    telegramToken,
    openaiApiKey,
    openaiModel: process.env.OPENAI_MODEL || 'chatgpt-4o-latest',
    maxTokens: Number(process.env.MAX_TOKENS || '1000'),
    temperature: parseFloat(process.env.TEMPERATURE || '0.7'),
    openweatherApiKey: process.env.OPENWEATHER_API_KEY,
    cityName: process.env.CITY_NAME || 'Jakarta',
    countryCode: process.env.COUNTRY_CODE || 'ID',
    reminderUserId: process.env.REMINDER_USER_ID ? Number(process.env.REMINDER_USER_ID) : undefined,
    reminderTime: process.env.REMINDER_TIME || '08:00',
    reminderTimezone: process.env.REMINDER_TIMEZONE || 'Asia/Jakarta',
  };
}

export function formatUserName(firstName?: string, lastName?: string, username?: string): string {
  if (firstName && lastName) {
    return `${firstName} ${lastName}`;
  }
  if (firstName) {
    return firstName;
  }
  if (username) {
    return `@${username}`;
  }
  return 'Unknown User';
}

export function truncateText(text: string, maxLength: number = 100): string {
  if (text.length <= maxLength) {
    return text;
  }
  return `${text.substring(0, maxLength)}...`;
}

export function formatTemperature(temp: number): string {
  return `${Math.round(temp)}°C`;
}

export function getWeatherEmoji(weatherMain: string): string {
  const weatherEmojis: { [key: string]: string } = {
    'Clear': '☀️',
    'Clouds': '☁️',
    'Rain': '🌧️',
    'Drizzle': '🌦️',
    'Thunderstorm': '⛈️',
    'Snow': '❄️',
    'Mist': '🌫️',
    'Smoke': '🌫️',
    'Haze': '🌫️',
    'Dust': '🌫️',
    'Fog': '🌫️',
    'Sand': '🌫️',
    'Ash': '🌫️',
    'Squall': '💨',
    'Tornado': '🌪️'
  };
  return weatherEmojis[weatherMain] || '🌤️';
}

// Keyword detection functions
export function isWeatherQuery(message: string): boolean {
  const weatherKeywords = [
    'cuaca', 'weather', 'panas', 'dingin', 'hujan', 'cerah', 'mendung', 
    'suhu', 'temperature', 'iklim', 'climate', 'angin', 'wind',
    'kelembaban', 'humidity', 'bagaimana cuaca', 'how is weather',
    'cuaca hari ini', 'weather today', 'kondisi cuaca', 'weather condition'
  ];
  
  const lowerMessage = message.toLowerCase();
  return weatherKeywords.some(keyword => lowerMessage.includes(keyword));
}

export function isWorkoutQuery(message: string): boolean {
  const workoutKeywords = [
    'olahraga', 'workout', 'exercise', 'fitness', 'jogging', 'lari',
    'gym', 'senam', 'berolahraga', 'latihan', 'training', 'sport',
    'apakah bisa olahraga', 'can I workout', 'boleh olahraga',
    'cocok olahraga', 'good for exercise', 'bisa lari', 'can run',
    'olahraga hari ini', 'workout today', 'exercise today'
  ];
  
  const lowerMessage = message.toLowerCase();
  return workoutKeywords.some(keyword => lowerMessage.includes(keyword));
}

export function isAITrigger(message: string): boolean {
  const aiTriggers = [
    '/ai', 'ai mode', 'chatgpt', 'chat gpt', 'gpt', 'assistant',
    'asisten', 'tanya ai', 'ask ai', 'ai help', 'bantuan ai',
    'aktifkan ai', 'enable ai', 'mulai ai', 'start ai'
  ];
  
  const lowerMessage = message.toLowerCase();
  return aiTriggers.some(trigger => lowerMessage.includes(trigger));
}

export function isAIDisableTrigger(message: string): boolean {
  const disableTriggers = [
    '/stop_ai', 'stop ai', 'matikan ai', 'disable ai', 'hentikan ai',
    'keluar ai', 'exit ai', 'quit ai', 'ai off', 'off ai'
  ];
  
  const lowerMessage = message.toLowerCase();
  return disableTriggers.some(trigger => lowerMessage.includes(trigger));
}
