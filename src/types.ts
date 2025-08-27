export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatHistory {
  [userId: number]: ChatMessage[];
}

export interface UserSession {
  aiMode: boolean;
  lastActivity?: Date;
}

export interface UserSessions {
  [userId: number]: UserSession;
}

export interface BotConfig {
  telegramToken: string;
  openaiApiKey: string;
  openaiModel: string;
  maxTokens: number;
  temperature: number;
  openweatherApiKey?: string;
  cityName?: string;
  countryCode?: string;
  reminderUserId?: number;
  reminderTime?: string;
  reminderTimezone?: string;
}

export interface UserInfo {
  id: number;
  firstName?: string;
  lastName?: string;
  username?: string;
}

export interface WeatherData {
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  name: string;
  visibility: number;
  wind: {
    speed: number;
  };
}

export interface WorkoutReminder {
  userId: number;
  time: string;
  timezone: string;
  enabled: boolean;
}
