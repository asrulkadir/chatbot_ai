import axios from 'axios';
import type { WeatherData } from './types';

export class WeatherService {
  private apiKey: string;
  private baseUrl = 'https://api.openweathermap.org/data/2.5/weather';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async getCurrentWeather(city: string, countryCode: string): Promise<WeatherData> {
    try {
      const response = await axios.get(this.baseUrl, {
        params: {
          q: `${city},${countryCode}`,
          appid: this.apiKey,
          units: 'metric', // Celsius
          lang: 'id' // Bahasa Indonesia
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching weather data:', error);
      throw new Error('Gagal mengambil data cuaca');
    }
  }

  async isGoodWeatherForWorkout(city: string, countryCode: string): Promise<{
    isGood: boolean;
    reason: string;
    weather: WeatherData;
  }> {
    const weather = await this.getCurrentWeather(city, countryCode);
    
    const weatherMain = weather.weather[0].main.toLowerCase();
    const temp = weather.main.temp;
    const humidity = weather.main.humidity;
    const windSpeed = weather.wind.speed;

    // Kriteria cuaca yang baik untuk olahraga outdoor:
    // - Tidak hujan/badai
    // - Suhu antara 20-35°C
    // - Kelembaban < 85%
    // - Kecepatan angin < 10 m/s
    
    if (weatherMain.includes('rain') || weatherMain.includes('drizzle')) {
      return {
        isGood: false,
        reason: 'Sedang hujan, lebih baik olahraga di dalam ruangan',
        weather
      };
    }

    if (weatherMain.includes('thunderstorm')) {
      return {
        isGood: false,
        reason: 'Ada badai petir, tidak aman untuk olahraga outdoor',
        weather
      };
    }

    if (temp < 15) {
      return {
        isGood: false,
        reason: 'Cuaca terlalu dingin untuk jogging',
        weather
      };
    }

    if (temp > 35) {
      return {
        isGood: false,
        reason: 'Cuaca terlalu panas, lebih baik olahraga sore hari',
        weather
      };
    }

    if (humidity > 85) {
      return {
        isGood: false,
        reason: 'Kelembaban sangat tinggi, mungkin tidak nyaman untuk jogging',
        weather
      };
    }

    if (windSpeed > 10) {
      return {
        isGood: false,
        reason: 'Angin terlalu kencang untuk jogging',
        weather
      };
    }

    return {
      isGood: true,
      reason: 'Cuaca sangat bagus untuk jogging!',
      weather
    };
  }
}
