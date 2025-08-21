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
    openaiModel: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
    maxTokens: parseInt(process.env.MAX_TOKENS || '1000'),
    temperature: parseFloat(process.env.TEMPERATURE || '0.7'),
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
  return text.substring(0, maxLength) + '...';
}
