export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatHistory {
  [userId: number]: ChatMessage[];
}

export interface UserSession {
  aiMode: boolean;
  language: 'id' | 'en';
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
  cityName?: string;
  countryCode?: string;
  regionIdn?: string;
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

// Interface untuk response BMKG asli
export interface BMKGLocation {
  adm1: string;
  adm2: string;
  adm3: string;
  adm4: string;
  provinsi: string;
  kotkab: string;
  kecamatan: string;
  desa: string;
  lon: number;
  lat: number;
  timezone: string;
  type?: string;
}

export interface BMKGWeatherItem {
  datetime: string;
  t: number; // Temperature
  tcc: number; // Total Cloud Cover
  tp: number; // Total Precipitation
  weather: number; // Weather code
  weather_desc: string; // Indonesian description
  weather_desc_en: string; // English description
  wd_deg: number; // Wind direction in degrees
  wd: string; // Wind direction
  wd_to: string; // Wind direction to
  ws: number; // Wind speed
  hu: number; // Humidity
  vs: number; // Visibility in meters
  vs_text: string; // Visibility text
  time_index: string;
  analysis_date: string;
  image: string;
  utc_datetime: string;
  local_datetime: string;
}

export interface BMKGDataItem {
  lokasi: BMKGLocation;
  cuaca: BMKGWeatherItem[][];
}

export interface BMKGResponse {
  lokasi: BMKGLocation;
  data: BMKGDataItem[];
}

export interface WorkoutReminder {
  userId: number;
  time: string;
  timezone: string;
  enabled: boolean;
}
