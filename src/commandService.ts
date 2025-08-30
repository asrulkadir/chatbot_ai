import type { UserSessions } from './types';
import type { TelegramService } from './telegramService';
import type { WeatherService } from './weatherService';
import type { ChatGPTService } from './chatGPTService';
import { formatTemperature, getWeatherEmoji } from './utils';
import { getMessages } from './messages';

export class CommandService {
  private telegramService: TelegramService;
  private weatherService: WeatherService;
  private chatGPTService: ChatGPTService;
  private userSessions: UserSessions;

  constructor(
    telegramService: TelegramService,
    chatGPTService: ChatGPTService,
    userSessions: UserSessions,
    weatherService: WeatherService
  ) {
    this.telegramService = telegramService;
    this.chatGPTService = chatGPTService;
    this.userSessions = userSessions;
    this.weatherService = weatherService;
  }

  async handleStartCommand(chatId: number, userId?: number): Promise<void> {
    const language =
      userId && this.userSessions[userId]
        ? this.userSessions[userId].language
        : 'en';
    const msg = getMessages(language);

    const welcomeMessage = `
${msg.welcome.title}

${msg.welcome.description}

${msg.welcome.usage}
${msg.welcome.aiMode}
${msg.welcome.aiOff}
${msg.welcome.weather}
${msg.welcome.help}

${msg.welcome.start}
    `;

    await this.telegramService.sendMessage(chatId, welcomeMessage);
  }

  async handleHelpCommand(chatId: number, userId?: number): Promise<void> {
    const language =
      userId && this.userSessions[userId]
        ? this.userSessions[userId].language
        : 'en';
    const msg = getMessages(language);

    const helpMessage = `
${msg.help.title}

${msg.help.commands}
${msg.commands.start}
${msg.commands.help}
${msg.commands.clear}
${msg.commands.ai}
${msg.commands.aiOff}
${msg.commands.weather}
${msg.commands.workout}

${msg.help.features}
• 💬 ${
      language === 'id'
        ? 'Percakapan natural dengan AI (perlu aktivasi)'
        : 'Natural conversation with AI (activation required)'
    }
• 🧠 ${
      language === 'id'
        ? 'Menyimpan konteks percakapan'
        : 'Save conversation context'
    }
• 🌍 ${
      language === 'id'
        ? 'Mendukung bahasa Indonesia dan Inggris'
        : 'Support Indonesian and English languages'
    }
• ⚡ ${
      language === 'id'
        ? 'Respons cepat dan akurat'
        : 'Fast and accurate responses'
    }
• 🌤️ ${
      language === 'id'
        ? 'Informasi cuaca real-time'
        : 'Real-time weather information'
    }
• 🏃‍♂️ ${
      language === 'id'
        ? 'Pengingat olahraga otomatis'
        : 'Automatic workout reminders'
    }
• 🤖 ${
      language === 'id'
        ? 'Mode AI on/off sesuai kebutuhan'
        : 'AI mode on/off as needed'
    }

${msg.help.tips}
${msg.help.aiActivation}
${msg.help.weatherAuto}

${msg.help.startMessage}
    `;

    await this.telegramService.sendMessage(chatId, helpMessage);
  }

  async handleClearCommand(chatId: number, userId: number): Promise<void> {
    this.chatGPTService.clearHistory(userId);

    const language = this.userSessions[userId]?.language || 'en';
    const msg = getMessages(language);

    await this.telegramService.sendMessage(chatId, msg.messages.historyCleared);
  }

  async handleAICommand(chatId: number, userId: number): Promise<void> {
    if (!this.userSessions[userId]) {
      this.userSessions[userId] = { aiMode: false, language: 'en' };
    }

    this.userSessions[userId].aiMode = true;

    const language = this.userSessions[userId].language;
    const msg = getMessages(language);

    await this.telegramService.sendMessage(chatId, msg.messages.aiModeEnabled);
  }

  async handleAIOffCommand(chatId: number, userId: number): Promise<void> {
    if (!this.userSessions[userId]) {
      this.userSessions[userId] = { aiMode: false, language: 'en' };
    }

    this.userSessions[userId].aiMode = false;

    const language = this.userSessions[userId].language;
    const msg = getMessages(language);

    await this.telegramService.sendMessage(chatId, msg.messages.aiModeDisabled);
  }

  async handleWeatherCommand(chatId: number, userId?: number): Promise<void> {
    const language =
      userId && this.userSessions[userId]
        ? this.userSessions[userId].language
        : 'en';
    const msg = getMessages(language);

    try {
      await this.telegramService.sendChatAction(chatId, 'typing');

      const res = await this.weatherService.getWeather(language);

      const weather = res.data[0]?.cuaca[0]?.[0];
      const location = res.lokasi;

      const weatherEmoji = getWeatherEmoji(weather.weather_desc_en);

      const message = `
${weatherEmoji} ${msg.weather.currentWeather}

${msg.weather.location} ${location.kotkab}
${weatherEmoji} ${msg.weather.condition} ${
        language === 'id' ? weather.weather_desc : weather.weather_desc_en
      }
${msg.weather.temperature} ${formatTemperature(weather.t)}
${msg.weather.humidity} ${weather.hu}%
${msg.weather.windSpeed} ${weather.ws} m/s
${msg.weather.visibility} ${(weather.vs / 1000).toFixed(1)} km
${msg.weather.time} ${weather.local_datetime}

${msg.weather.dataSource}
      `;

      await this.telegramService.sendMessage(chatId, message, 'Markdown');
    } catch (error) {
      console.error('Error getting weather:', error);
      await this.telegramService.sendMessage(chatId, msg.messages.weatherError);
    }
  }

  async handleWorkoutCommand(chatId: number, userId?: number): Promise<void> {
    const language =
      userId && this.userSessions[userId]
        ? this.userSessions[userId].language
        : 'en';
    const msg = getMessages(language);

    try {
      await this.telegramService.sendChatAction(chatId, 'typing');

      const weatherCheck = await this.weatherService.isGoodWeatherForWorkout(
        language
      );

      const weather = weatherCheck.weather?.[0];
      const location = weatherCheck.location;
      const weatherEmoji = getWeatherEmoji(weather.weather_desc_en);

      let message: string;

      if (weatherCheck.isGood) {
        message = `
${msg.weather.goodForWorkout} ${weatherEmoji}

${msg.weather.location} ${location.kotkab}
${msg.weather.temperature} ${formatTemperature(weather.t)}°C
${msg.weather.humidity} ${weather.hu}%
${msg.weather.windSpeed} ${weather.ws} m/s
${weatherEmoji} ${msg.weather.condition} ${
          language === 'id' ? weather.weather_desc : weather.weather_desc_en
        }
${msg.weather.time} ${weather.local_datetime}

${msg.weather.dataSource}

✅ ${weatherCheck.reason}

${msg.weather.recommendations}
${msg.weather.useProperClothing}
${msg.weather.stayHydrated}
${msg.weather.warmUp}
${msg.weather.chooseRightTime}

${msg.weather.enjoyWorkout}
        `;
      } else {
        message = `
${msg.weather.notGoodForWorkout}

${msg.weather.location} ${location.kotkab}
${msg.weather.temperature} ${formatTemperature(weather.t)}°C
${msg.weather.humidity} ${weather.hu}%
${msg.weather.windSpeed} ${weather.ws} m/s
${weatherEmoji} ${msg.weather.condition} ${
          language === 'id' ? weather.weather_desc : weather.weather_desc_en
        }
${msg.weather.time} ${weather.local_datetime}

${msg.weather.dataSource}

⚠️ ${weatherCheck.reason}

${msg.weather.indoorAlternatives}
${msg.weather.homeWorkout}
${msg.workoutReminder.badWeather.activeGames}

${msg.weather.keepSpirit}
        `;
      }

      await this.telegramService.sendMessage(chatId, message, 'Markdown');
    } catch (error) {
      console.error('Error checking workout weather:', error);
      await this.telegramService.sendMessage(chatId, msg.messages.workoutError);
    }
  }
}
