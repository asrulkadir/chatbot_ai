// Types untuk aplikasi
export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatHistory {
  [userId: number]: ChatMessage[];
}

export interface BotConfig {
  telegramToken: string;
  openaiApiKey: string;
  openaiModel: string;
  maxTokens: number;
  temperature: number;
}

export interface UserInfo {
  id: number;
  firstName?: string;
  lastName?: string;
  username?: string;
}
