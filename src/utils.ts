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
  let name = '';
  if (firstName) name += firstName;
  if (lastName) name += ` ${lastName}`;
  if (!name && username) name = username;
  return name || 'User';
}

export function detectLanguage(text: string): 'id' | 'en' {
  const indonesianWords = [
    'halo', 'hai', 'selamat', 'pagi', 'siang', 'malam', 'terima', 'kasih', 'maaf', 'tolong', 
    'bantuan', 'bagaimana', 'kapan', 'dimana', 'kenapa', 'siapa', 'apa', 'yang', 'dan', 
    'atau', 'dengan', 'untuk', 'dari', 'ke', 'di', 'pada', 'dalam', 'cuaca', 'olahraga',
    'latihan', 'senam', 'lari', 'jalan', 'jogging', 'panas', 'dingin', 'hujan', 'cerah',
    'mendung', 'angin', 'saya', 'kamu', 'dia', 'kita', 'mereka', 'ini', 'itu', 'disini',
    'disana', 'sekarang', 'nanti', 'kemarin', 'besok', 'hari', 'minggu', 'bulan', 'tahun'
  ];
  
  const englishWords = [
    'hello', 'hi', 'good', 'morning', 'afternoon', 'evening', 'thank', 'thanks', 'sorry', 
    'please', 'help', 'how', 'when', 'where', 'why', 'who', 'what', 'and', 'or', 'with', 
    'for', 'from', 'to', 'in', 'on', 'at', 'weather', 'workout', 'exercise', 'training',
    'running', 'jogging', 'walk', 'hot', 'cold', 'rain', 'sunny', 'cloudy', 'wind',
    'i', 'you', 'he', 'she', 'we', 'they', 'this', 'that', 'here', 'there', 'now',
    'later', 'yesterday', 'tomorrow', 'day', 'week', 'month', 'year'
  ];
  
  const words = text.toLowerCase().split(/\s+/);
  let indonesianScore = 0;
  let englishScore = 0;
  
  for (const word of words) {
    if (indonesianWords.includes(word)) {
      indonesianScore++;
    }
    if (englishWords.includes(word)) {
      englishScore++;
    }
  }
  
  return indonesianScore > englishScore ? 'id' : 'en';
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
