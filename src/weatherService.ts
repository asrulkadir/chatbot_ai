import axios from 'axios';
import { getMessages } from './messages';
import type { BMKGLocation, BMKGResponse, BMKGWeatherItem } from './types';
import { loadConfig } from './utils';

export class WeatherService {
  private baseUrl = 'https://api.bmkg.go.id/publik/prakiraan-cuaca';
  private config = loadConfig();

  async getWeather(_language: 'id' | 'en' = 'en'): Promise<BMKGResponse> {
    try {
      const regionCode = this.config.regionIdn;

      const response = await axios.get(this.baseUrl, {
        params: {
          adm4: regionCode,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching BMKG weather data:', error);
      const messages = getMessages(_language);
      throw new Error(messages.weather.errors.fetchFailed);
    }
  }

  async isGoodWeatherForWorkout(language: 'id' | 'en' = 'en'): Promise<{
    isGood: boolean;
    reason: string;
    location: BMKGLocation;
    weather: BMKGWeatherItem[];
  }> {
    const weather = await this.getWeather(language);
    const messages = getMessages(language);

    // Get weather code and location
    const weatherCode = weather.data[0]?.cuaca[0]?.[0]?.weather;
    const location = weather?.lokasi;

    if (weatherCode >= 0 && weatherCode <= 3) {
      return {
        isGood: true,
        reason: messages.weather.conditions.perfectForJogging,
        location,
        weather: weather.data[0]?.cuaca?.[0],
      };
    }

    return {
      isGood: false,
      reason: messages.weather.conditions.notPerfectForJogging,
      location,
      weather: weather.data[0]?.cuaca?.flat(),
    };
  }
}
