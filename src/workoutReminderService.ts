import * as cron from 'node-cron';
import { WeatherService } from './weatherService';
import { formatTemperature, getWeatherEmoji } from './utils';
import { getMessages } from './messages';

export class WorkoutReminderService {
  private weatherService: WeatherService;
  private reminderJob: cron.ScheduledTask | null = null;
  private sendMessageFunc: (
    chatId: number,
    text: string,
    parseMode?: 'Markdown' | 'HTML'
  ) => Promise<void>;

  constructor(
    sendMessageFunc: (
      chatId: number,
      text: string,
      parseMode?: 'Markdown' | 'HTML'
    ) => Promise<void>
  ) {
    this.sendMessageFunc = sendMessageFunc;
    this.weatherService = new WeatherService();
  }

  startWeekendReminder(
    userId: number,
    time: string,
    timezone: string,
    language: 'id' | 'en' = 'id'
  ): void {
    // Schedule reminder for every Saturday
    // Format: 'minute hour * * day'
    // day: 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const [hour, minute] = time.split(':');
    const cronExpression = `${minute} ${hour} * * 6`; // Every Saturday

    console.log(
      `🕐 Setting up workout reminder for every Saturday at ${time} (${timezone})`
    );

    this.reminderJob = cron.schedule(
      cronExpression,
      async () => {
        await this.sendWorkoutReminder(userId, language);
      },
      {
        scheduled: true,
        timezone: timezone,
      }
    );

    console.log(`✅ Workout reminder successfully set up!`);
  }

  private async sendWorkoutReminder(
    userId: number,
    language: 'id' | 'en' = 'id'
  ): Promise<void> {
    try {
      console.log(`🏃‍♂️ Sending workout reminder to user ${userId}`);
      const messages = getMessages(language);

      // Check weather conditions
      const weatherCheck = await this.weatherService.isGoodWeatherForWorkout(
        language
      );
      const weather = weatherCheck.weather?.[0];
      const location = weatherCheck.location;
      const weatherEmoji = getWeatherEmoji(weather?.weather_desc_en);

      if (weatherCheck.isGood) {
        // Weather is good - suggest jogging
        const message = `
${messages.workoutReminder.weekendTitleGoodWeather}

${messages.workoutReminder.goodWeather.greeting}

${messages.weather.location} ${location.kotkab}
${weatherEmoji} ${messages.weather.condition} ${
          language === 'id' ? weather.weather_desc : weather.weather_desc_en
        }
${messages.weather.temperature} ${formatTemperature(weather.t)}
${messages.weather.humidity} ${weather.hu}%
${messages.weather.windSpeed} ${weather.ws} m/s
${messages.weather.visibility} ${(weather.vs / 1000).toFixed(1)} km
${messages.weather.time} ${weather.local_datetime}

${messages.weather.dataSource}

${weatherCheck.reason} 🌟

${messages.workoutReminder.goodWeather.tipsTitle}
${messages.workoutReminder.goodWeather.weatherClothing}
${messages.workoutReminder.goodWeather.bringWater}
${messages.workoutReminder.goodWeather.warmUpCoolDown}
${messages.workoutReminder.goodWeather.chooseRoute}

${messages.workoutReminder.goodWeather.letsStart}
        `;

        await this.sendMessageFunc(userId, message, 'Markdown');
      } else {
        // Weather is not good - suggest indoor exercise
        const message = `
${messages.workoutReminder.weekendTitleBadWeather}

${messages.workoutReminder.badWeather.greeting}

${messages.weather.location} ${location.kotkab}
${weatherEmoji} ${messages.weather.condition} ${
          language === 'id' ? weather.weather_desc : weather.weather_desc_en
        }
${messages.weather.temperature} ${formatTemperature(weather.t)}
${messages.weather.humidity} ${weather.hu}%
${messages.weather.windSpeed} ${weather.ws} m/s
${messages.weather.visibility} ${(weather.vs / 1000).toFixed(1)} km
${messages.weather.time} ${weather.local_datetime}

${messages.weather.dataSource}

⚠️ ${weatherCheck.reason}

${messages.workoutReminder.badWeather.alternativesTitle}
${messages.workoutReminder.badWeather.homeWorkout}
${messages.workoutReminder.badWeather.activeGames}

${messages.workoutReminder.badWeather.keepSpirit}
        `;

        await this.sendMessageFunc(userId, message, 'Markdown');
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

      await this.sendMessageFunc(userId, fallbackMessage, 'Markdown');
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
