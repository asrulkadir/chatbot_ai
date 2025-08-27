import axios from 'axios';
import type { WeatherData } from './types';
import { getMessages } from './messages';

export class WeatherService {
  private apiKey: string;
  private baseUrl = 'https://api.openweathermap.org/data/2.5/weather';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async getCurrentWeather(city: string, countryCode: string, language: 'id' | 'en' = 'en'): Promise<WeatherData> {
    try {
      const response = await axios.get(this.baseUrl, {
        params: {
          q: `${city},${countryCode}`,
          appid: this.apiKey,
          units: 'metric', // Celsius
          lang: language // Dynamic language based on user preference
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching weather data:', error);
      const messages = getMessages(language);
      throw new Error(messages.weather.errors.fetchFailed);
    }
  }

  async isGoodWeatherForWorkout(city: string, countryCode: string, language: 'id' | 'en' = 'en'): Promise<{
    isGood: boolean;
    reason: string;
    weather: WeatherData;
  }> {
    const weather = await this.getCurrentWeather(city, countryCode, language);
    const messages = getMessages(language);
    
    const weatherMain = weather.weather[0].main.toLowerCase();
    const temp = weather.main.temp;
    const humidity = weather.main.humidity;
    const windSpeed = weather.wind.speed;

    // Weather conditions for good jogging:
    // - No rain/storm
    // - Temperature between 15-35°C
    // - Humidity < 85%
    // - Wind speed < 10 m/s

    if (weatherMain.includes('rain') || weatherMain.includes('drizzle')) {
      return {
        isGood: false,
        reason: messages.weather.conditions.rainy,
        weather
      };
    }

    if (weatherMain.includes('thunderstorm')) {
      return {
        isGood: false,
        reason: messages.weather.conditions.thunderstorm,
        weather
      };
    }

    if (temp < 15) {
      return {
        isGood: false,
        reason: messages.weather.conditions.tooCold,
        weather
      };
    }

    if (temp > 35) {
      return {
        isGood: false,
        reason: messages.weather.conditions.tooHot,
        weather
      };
    }

    if (humidity > 85) {
      return {
        isGood: false,
        reason: messages.weather.conditions.highHumidity,
        weather
      };
    }

    if (windSpeed > 10) {
      return {
        isGood: false,
        reason: messages.weather.conditions.strongWind,
        weather
      };
    }

    return {
      isGood: true,
      reason: messages.weather.conditions.perfectForJogging,
      weather
    };
  }
}
