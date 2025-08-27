import type { UserSessions, BotConfig } from './types';
import type { TelegramService } from './telegramService';
import type { WeatherService } from './weatherService';
import type { WorkoutReminderService } from './workoutReminderService';
import type { ChatGPTService } from './chatGPTService';
import { formatTemperature, getWeatherEmoji } from './utils';

export class CommandService {
  private telegramService: TelegramService;
  private weatherService: WeatherService | null;
  private workoutReminderService: WorkoutReminderService | null;
  private chatGPTService: ChatGPTService;
  private userSessions: UserSessions;
  private config: BotConfig;

  constructor(
    telegramService: TelegramService,
    chatGPTService: ChatGPTService,
    config: BotConfig,
    userSessions: UserSessions,
    weatherService?: WeatherService,
    workoutReminderService?: WorkoutReminderService
  ) {
    this.telegramService = telegramService;
    this.chatGPTService = chatGPTService;
    this.config = config;
    this.userSessions = userSessions;
    this.weatherService = weatherService || null;
    this.workoutReminderService = workoutReminderService || null;
  }

  async handleStartCommand(chatId: number): Promise<void> {
    const welcomeMessage = `
🤖 *Selamat datang di AI Chatbot!*

Halo! Saya adalah chatbot AI yang didukung oleh ChatGPT. Saya siap membantu Anda dengan berbagai pertanyaan dan percakapan.

*Cara menggunakan:*
• Ketik /ai untuk mengaktifkan mode AI ChatGPT
• Ketik /ai_off untuk menonaktifkan mode AI
• Tanya tentang cuaca atau workout untuk info otomatis
• Ketik /clear untuk menghapus history percakapan
• Ketik /help untuk melihat bantuan

Silakan mulai percakapan dengan mengirim pesan!
    `;

    await this.telegramService.sendMessage(chatId, welcomeMessage, 'Markdown');
  }

  async handleHelpCommand(chatId: number): Promise<void> {
    const helpMessage = `
📋 *Bantuan AI Chatbot*

*Perintah yang tersedia:*
• /start - Memulai percakapan
• /help - Menampilkan bantuan ini
• /clear - Menghapus history percakapan
• /ai - Aktifkan mode AI ChatGPT
• /ai_off - Nonaktifkan mode AI ChatGPT
• /weather - Cek cuaca saat ini
• /workout - Cek cuaca untuk olahraga
• /reminder - Atur pengingat olahraga weekend
• /stop_reminder - Hentikan pengingat olahraga

*Fitur:*
• 💬 Percakapan natural dengan AI (perlu aktivasi)
• 🧠 Menyimpan konteks percakapan
• 🌍 Mendukung bahasa Indonesia
• ⚡ Respons cepat dan akurat
• 🌤️ Informasi cuaca real-time
• 🏃‍♂️ Pengingat olahraga otomatis
• 🤖 Mode AI on/off sesuai kebutuhan

*Tips:*
• Aktifkan mode AI dengan /ai untuk chat dengan ChatGPT
• Tanya tentang "cuaca" atau "workout" untuk info otomatis
• Pengingat olahraga akan dikirim setiap Sabtu

Mulai percakapan dengan mengirim pesan apa saja!
    `;

    await this.telegramService.sendMessage(chatId, helpMessage, 'Markdown');
  }

  async handleClearCommand(chatId: number, userId: number): Promise<void> {
    this.chatGPTService.clearHistory(userId);
    await this.telegramService.sendMessage(chatId, '🗑️ History percakapan telah dihapus. Silakan mulai percakapan baru!');
  }

  async handleAICommand(chatId: number, userId: number): Promise<void> {
    if (!this.userSessions[userId]) {
      this.userSessions[userId] = { aiMode: false };
    }
    
    this.userSessions[userId].aiMode = true;
    
    await this.telegramService.sendMessage(
      chatId, 
      '🤖 *Mode AI ChatGPT diaktifkan!*\n\nSekarang semua pesan Anda akan diproses oleh ChatGPT. Ketik /ai_off untuk menonaktifkan.',
      'Markdown'
    );
  }

  async handleAIOffCommand(chatId: number, userId: number): Promise<void> {
    if (!this.userSessions[userId]) {
      this.userSessions[userId] = { aiMode: false };
    }
    
    this.userSessions[userId].aiMode = false;
    
    await this.telegramService.sendMessage(
      chatId, 
      '🚫 *Mode AI ChatGPT dinonaktifkan!*\n\nSekarang bot akan merespons hanya untuk command khusus dan query cuaca/workout.',
      'Markdown'
    );
  }

  async handleWeatherCommand(chatId: number): Promise<void> {
    if (!this.weatherService) {
      await this.telegramService.sendMessage(chatId, '❌ Layanan cuaca tidak tersedia. API key cuaca belum dikonfigurasi.');
      return;
    }

    try {
      await this.telegramService.sendChatAction(chatId, 'typing');
      
      const weather = await this.weatherService.getCurrentWeather(
        this.config.cityName || 'Jakarta',
        this.config.countryCode || 'ID'
      );
      
      const weatherEmoji = getWeatherEmoji(weather.weather[0].main);
      
      const message = `
🌤️ *Cuaca Saat Ini*

📍 *Lokasi:* ${weather.name}
${weatherEmoji} *Kondisi:* ${weather.weather[0].description}
🌡️ *Suhu:* ${formatTemperature(weather.main.temp)} (terasa ${formatTemperature(weather.main.feels_like)})
💧 *Kelembaban:* ${weather.main.humidity}%
🌪️ *Kecepatan Angin:* ${weather.wind.speed} m/s
👁️ *Visibilitas:* ${weather.visibility/1000} km

_Data diambil dari OpenWeatherMap_
      `;
      
      await this.telegramService.sendMessage(chatId, message, 'Markdown');
    } catch (error) {
      console.error('Error getting weather:', error);
      await this.telegramService.sendMessage(chatId, '❌ Maaf, tidak bisa mengambil data cuaca saat ini. Silakan coba lagi nanti.');
    }
  }

  async handleWorkoutCommand(chatId: number): Promise<void> {
    if (!this.weatherService) {
      await this.telegramService.sendMessage(chatId, '❌ Layanan cuaca tidak tersedia. API key cuaca belum dikonfigurasi.');
      return;
    }

    try {
      await this.telegramService.sendChatAction(chatId, 'typing');
      
      const weatherCheck = await this.weatherService.isGoodWeatherForWorkout(
        this.config.cityName || 'Jakarta',
        this.config.countryCode || 'ID'
      );
      
      const weather = weatherCheck.weather;
      const weatherEmoji = getWeatherEmoji(weather.weather[0].main);
      
      let message: string;
      
      if (weatherCheck.isGood) {
        message = `
🏃‍♂️ *Cuaca Bagus untuk Olahraga!* ${weatherEmoji}

📍 *Lokasi:* ${weather.name}
🌡️ *Suhu:* ${formatTemperature(weather.main.temp)} (terasa ${formatTemperature(weather.main.feels_like)})
💧 *Kelembaban:* ${weather.main.humidity}%
🌪️ *Angin:* ${weather.wind.speed} m/s
☀️ *Kondisi:* ${weather.weather[0].description}

✅ ${weatherCheck.reason}

*Rekomendasi:*
• Gunakan pakaian olahraga yang sesuai
• Jangan lupa minum air yang cukup
• Lakukan pemanasan sebelum olahraga
• Pilih waktu yang tepat untuk berolahraga

Selamat berolahraga! 💪🔥
        `;
      } else {
        message = `
🏠 *Cuaca Kurang Ideal untuk Olahraga Outdoor* ${weatherEmoji}

📍 *Lokasi:* ${weather.name}
🌡️ *Suhu:* ${formatTemperature(weather.main.temp)} (terasa ${formatTemperature(weather.main.feels_like)})
💧 *Kelembaban:* ${weather.main.humidity}%
🌪️ *Angin:* ${weather.wind.speed} m/s
⛅ *Kondisi:* ${weather.weather[0].description}

⚠️ ${weatherCheck.reason}

*Alternatif olahraga indoor:*
• 🏋️‍♂️ Workout di rumah
• 🧘‍♀️ Yoga atau stretching
• 💃 Dance workout
• 🥊 Shadow boxing

Tetap semangat berolahraga! 💪
        `;
      }
      
      await this.telegramService.sendMessage(chatId, message, 'Markdown');
    } catch (error) {
      console.error('Error checking workout weather:', error);
      await this.telegramService.sendMessage(chatId, '❌ Maaf, tidak bisa mengecek cuaca untuk olahraga saat ini. Silakan coba lagi nanti.');
    }
  }

  async handleReminderCommand(chatId: number, userId: number): Promise<void> {
    if (!this.workoutReminderService) {
      await this.telegramService.sendMessage(chatId, '❌ Layanan pengingat tidak tersedia.');
      return;
    }

    if (!this.config.openweatherApiKey) {
      await this.telegramService.sendMessage(chatId, '❌ API key cuaca belum dikonfigurasi. Pengingat tidak dapat diaktifkan.');
      return;
    }

    try {
      if (this.workoutReminderService.isReminderActive()) {
        await this.telegramService.sendMessage(chatId, '✅ Pengingat olahraga sudah aktif! Anda akan mendapat pengingat setiap hari Sabtu.');
        return;
      }

      this.workoutReminderService.startWeekendReminder(
        userId,
        this.config.reminderTime || '08:00',
        this.config.reminderTimezone || 'Asia/Jakarta',
        this.config.cityName || 'Jakarta',
        this.config.countryCode || 'ID'
      );

      const message = `
🏃‍♂️ *Pengingat Olahraga Diaktifkan!*

✅ Anda akan mendapat pengingat olahraga setiap *hari Sabtu* jam *${this.config.reminderTime}*
📍 Lokasi cuaca: ${this.config.cityName}, ${this.config.countryCode}
🕐 Timezone: ${this.config.reminderTimezone}

Bot akan mengecek cuaca terlebih dahulu dan memberikan rekomendasi olahraga yang sesuai.

Gunakan /stop_reminder untuk menghentikan pengingat.
      `;

      await this.telegramService.sendMessage(chatId, message, 'Markdown');
    } catch (error) {
      console.error('Error setting up reminder:', error);
      await this.telegramService.sendMessage(chatId, '❌ Gagal mengatur pengingat. Silakan coba lagi nanti.');
    }
  }

  async handleStopReminderCommand(chatId: number): Promise<void> {
    if (!this.workoutReminderService) {
      await this.telegramService.sendMessage(chatId, '❌ Layanan pengingat tidak tersedia.');
      return;
    }

    if (!this.workoutReminderService.isReminderActive()) {
      await this.telegramService.sendMessage(chatId, '⚠️ Pengingat olahraga tidak sedang aktif.');
      return;
    }

    this.workoutReminderService.stopReminder();
    await this.telegramService.sendMessage(chatId, '🛑 Pengingat olahraga telah dihentikan.');
  }
}
