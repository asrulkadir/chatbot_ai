import * as cron from 'node-cron';
import { WeatherService } from './weatherService';
import { formatTemperature, getWeatherEmoji } from './utils';

export class WorkoutReminderService {
  private weatherService: WeatherService | null = null;
  private reminderJob: cron.ScheduledTask | null = null;
  private sendMessageFunc: (chatId: number, text: string, parseMode?: string) => Promise<void>;

  constructor(
    sendMessageFunc: (chatId: number, text: string, parseMode?: string) => Promise<void>,
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
    countryCode: string
  ): void {
    // Schedule untuk setiap hari Sabtu
    // Format: 'minute hour * * day'
    // day: 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const [hour, minute] = time.split(':');
    const cronExpression = `${minute} ${hour} * * 6`; // Setiap Sabtu
    
    console.log(`🕐 Mengatur pengingat workout untuk setiap Sabtu jam ${time} (${timezone})`);
    console.log(`📍 Lokasi: ${cityName}, ${countryCode}`);

    this.reminderJob = cron.schedule(
      cronExpression,
      async () => {
        await this.sendWorkoutReminder(userId, cityName, countryCode);
      },
      {
        scheduled: true,
        timezone: timezone
      }
    );

    console.log(`✅ Pengingat workout berhasil diatur!`);
  }

  private async sendWorkoutReminder(userId: number, cityName: string, countryCode: string): Promise<void> {
    try {
      console.log(`🏃‍♂️ Mengirim pengingat workout ke user ${userId}`);

      if (!this.weatherService) {
        // Jika tidak ada weather service, kirim pengingat biasa
        const message = `
🏃‍♂️ *Pengingat Olahraga Weekend!*

Halo! Ini hari Sabtu, saatnya berolahraga! 💪

Jangan lupa untuk:
• Pemanasan sebelum olahraga
• Minum air yang cukup
• Gunakan sepatu olahraga yang nyaman

Selamat berolahraga! 🔥
        `;
        
        await this.sendMessageFunc(userId, message, 'Markdown');
        return;
      }

      // Cek cuaca terlebih dahulu
      const weatherCheck = await this.weatherService.isGoodWeatherForWorkout(cityName, countryCode);
      const weather = weatherCheck.weather;
      const weatherEmoji = getWeatherEmoji(weather.weather[0].main);
      
      if (weatherCheck.isGood) {
        // Cuaca bagus - ajak jogging
        const message = `
🏃‍♂️ *Pengingat Olahraga Weekend!*

Halo! Ini hari Sabtu dan cuaca sedang bagus untuk jogging! ${weatherEmoji}

📍 *Cuaca di ${weather.name}:*
🌡️ Suhu: ${formatTemperature(weather.main.temp)} (terasa ${formatTemperature(weather.main.feels_like)})
💧 Kelembaban: ${weather.main.humidity}%
🌪️ Angin: ${weather.wind.speed} m/s
👁️ Visibilitas: ${weather.visibility/1000} km

${weatherCheck.reason} 🌟

*Tips untuk jogging hari ini:*
• Gunakan pakaian yang sesuai dengan cuaca
• Bawa botol air minum
• Jangan lupa pemanasan dan pendinginan
• Pilih rute yang aman dan nyaman

Yuk mulai jogging! 🏃‍♂️💨
        `;
        
        await this.sendMessageFunc(userId, message, 'Markdown');
      } else {
        // Cuaca tidak bagus - sarankan olahraga indoor
        const message = `
🏠 *Pengingat Olahraga Weekend!*

Halo! Ini hari Sabtu, tapi... ${weatherEmoji}

📍 *Cuaca di ${weather.name}:*
🌡️ Suhu: ${formatTemperature(weather.main.temp)} (terasa ${formatTemperature(weather.main.feels_like)})
💧 Kelembaban: ${weather.main.humidity}%
🌪️ Angin: ${weather.wind.speed} m/s
☔ Kondisi: ${weather.weather[0].description}

⚠️ ${weatherCheck.reason}

*Alternatif olahraga indoor:*
• 🏋️‍♂️ Workout di rumah (push-up, sit-up, plank)
• 🧘‍♀️ Yoga atau stretching
• 💃 Dance workout dengan video YouTube
• 🏃‍♂️ Lari di treadmill (jika ada)
• 🥊 Shadow boxing

Jangan sampai cuaca menghalangi semangat olahraga! 💪🔥
        `;
        
        await this.sendMessageFunc(userId, message, 'Markdown');
      }

    } catch (error) {
      console.error('Error sending workout reminder:', error);
      
      // Fallback message jika ada error
      const fallbackMessage = `
🏃‍♂️ *Pengingat Olahraga Weekend!*

Halo! Ini hari Sabtu, saatnya berolahraga! 💪

Maaf, tidak bisa mengecek cuaca saat ini. Tapi jangan biarkan itu menghentikan semangat olahraga Anda!

Tetap semangat dan jaga kesehatan! 🔥
      `;
      
      try {
        await this.sendMessageFunc(userId, fallbackMessage, 'Markdown');
      } catch (fallbackError) {
        console.error('Error sending fallback message:', fallbackError);
      }
    }
  }

  stopReminder(): void {
    if (this.reminderJob) {
      this.reminderJob.stop();
      this.reminderJob = null;
      console.log('🛑 Pengingat workout dihentikan');
    }
  }

  isReminderActive(): boolean {
    return this.reminderJob !== null;
  }

  // Method untuk testing - kirim reminder sekarang
  async sendTestReminder(userId: number, cityName: string, countryCode: string): Promise<void> {
    console.log('🧪 Mengirim test reminder...');
    await this.sendWorkoutReminder(userId, cityName, countryCode);
  }
}
