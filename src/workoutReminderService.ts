import * as cron from 'node-cron';
import { WeatherService } from './weatherService';
import { formatTemperature, getWeatherEmoji } from './utils';
import { getMessages } from './messages';

export class WorkoutReminderService {
  private weatherService: WeatherService | null = null;
  private reminderJob: cron.ScheduledTask | null = null;
  private sendMessageFunc: (chatId: number, text: string) => Promise<void>;

  constructor(
    sendMessageFunc: (chatId: number, text: string) => Promise<void>,
    weatherApiKey?: string
  ) {
    this.sendMessageFunc = sendMessageFunc;
    
    if (weatherApiKey) {
      this.weatherService = new WeatherService(weatherApiKey);
    }
  }

  startWeekendReminder(
    userId: number, 
    time: string,
    timezone: string,
    cityName: string,
    countryCode: string,
    language: 'id' | 'en' = 'id'
  ): void {
    // Schedule reminder for every Saturday
    // Format: 'minute hour * * day'
    // day: 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const [hour, minute] = time.split(':');
    const cronExpression = `${minute} ${hour} * * 6`; // Every Saturday

    console.log(`🕐 Setting up workout reminder for every Saturday at ${time} (${timezone})`);
    console.log(`📍 Location: ${cityName}, ${countryCode}`);

    this.reminderJob = cron.schedule(
      cronExpression,
      async () => {
        await this.sendWorkoutReminder(userId, cityName, countryCode, language);
      },
      {
        scheduled: true,
        timezone: timezone
      }
    );

    console.log(`✅ Workout reminder successfully set up!`);
  }

  private async sendWorkoutReminder(userId: number, cityName: string, countryCode: string, language: 'id' | 'en' = 'id'): Promise<void> {
    try {
      console.log(`🏃‍♂️ Sending workout reminder to user ${userId}`);
      const messages = getMessages(language);

      if (!this.weatherService) {
        // Jika tidak ada weather service, kirim pengingat biasa
        const message = `
${messages.workoutReminder.basicReminder.title}

${messages.workoutReminder.basicReminder.greeting}

${messages.workoutReminder.basicReminder.dontForget}
${messages.workoutReminder.basicReminder.warmUp}
${messages.workoutReminder.basicReminder.stayHydrated}
${messages.workoutReminder.basicReminder.comfortableShoes}

${messages.workoutReminder.basicReminder.enjoyWorkout}
        `;
        
        await this.sendMessageFunc(userId, message);
        return;
      }

      // Check weather conditions
      const weatherCheck = await this.weatherService.isGoodWeatherForWorkout(cityName, countryCode, language);
      const weather = weatherCheck.weather;
      const weatherEmoji = getWeatherEmoji(weather.weather[0].main);
      
      if (weatherCheck.isGood) {
        // Weather is good - suggest jogging
        const message = `
${messages.workoutReminder.weekendTitleGoodWeather}

${messages.workoutReminder.goodWeather.greeting} ${weatherEmoji}

${messages.workoutReminder.weatherInfo} ${weather.name}:*
${messages.workoutReminder.temperature} ${formatTemperature(weather.main.temp)} ${messages.workoutReminder.feelsLike} ${formatTemperature(weather.main.feels_like)})
${messages.workoutReminder.humidity} ${weather.main.humidity}%
${messages.workoutReminder.wind} ${weather.wind.speed} m/s
${messages.workoutReminder.visibility} ${weather.visibility/1000} km

${weatherCheck.reason} 🌟

${messages.workoutReminder.goodWeather.tipsTitle}
${messages.workoutReminder.goodWeather.weatherClothing}
${messages.workoutReminder.goodWeather.bringWater}
${messages.workoutReminder.goodWeather.warmUpCoolDown}
${messages.workoutReminder.goodWeather.chooseRoute}

${messages.workoutReminder.goodWeather.letsStart}
        `;
        
        await this.sendMessageFunc(userId, message);
      } else {
        // Weather is not good - suggest indoor exercise
        const message = `
${messages.workoutReminder.weekendTitleBadWeather}

${messages.workoutReminder.badWeather.greeting} ${weatherEmoji}

${messages.workoutReminder.weatherInfo} ${weather.name}:*
${messages.workoutReminder.temperature} ${formatTemperature(weather.main.temp)} ${messages.workoutReminder.feelsLike} ${formatTemperature(weather.main.feels_like)})
${messages.workoutReminder.humidity} ${weather.main.humidity}%
${messages.workoutReminder.wind} ${weather.wind.speed} m/s
${messages.workoutReminder.condition} ${weather.weather[0].description}

⚠️ ${weatherCheck.reason}

${messages.workoutReminder.badWeather.alternativesTitle}
${messages.workoutReminder.badWeather.homeWorkout}
${messages.workoutReminder.badWeather.yoga}
${messages.workoutReminder.badWeather.danceWorkout}
${messages.workoutReminder.badWeather.shadowBoxing}
${messages.workoutReminder.badWeather.activeGames}

${messages.workoutReminder.badWeather.keepSpirit}
        `;
        
        await this.sendMessageFunc(userId, message);
      }
    } catch (error) {
      console.error('Error sending workout reminder:', error);
      const messages = getMessages(language);

      // Fallback message if there's an error
      const fallbackMessage = `
${messages.workoutReminder.fallback.title}

${messages.workoutReminder.fallback.greeting}

${messages.workoutReminder.fallback.weatherError}

${messages.workoutReminder.fallback.suggestions}
${messages.workoutReminder.fallback.checkWeather}
${messages.workoutReminder.fallback.sunnyActivity}
${messages.workoutReminder.fallback.rainyActivity}

${messages.workoutReminder.fallback.enjoy}
      `;
      
      await this.sendMessageFunc(userId, fallbackMessage);
    }
  }

  stopReminder(): void {
    if (this.reminderJob) {
      this.reminderJob.stop();
      this.reminderJob = null;
      console.log('🛑 Workout reminder stopped');
    }
  }

  isReminderActive(): boolean {
    return this.reminderJob !== null;
  }
}
