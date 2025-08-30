import type { UserSessions, BotConfig } from './types';
import { TelegramService, type TelegramUpdate } from './telegramService';
import { ChatGPTService } from './chatGPTService';
import { WeatherService } from './weatherService';
import { WorkoutReminderService } from './workoutReminderService';
import { CommandService } from './commandService';
import { MessageService } from './messageService';

export class BotService {
  private telegramService: TelegramService;
  private chatGPTService: ChatGPTService;
  private weatherService: WeatherService | null;
  private workoutReminderService: WorkoutReminderService | null;
  private commandService: CommandService;
  private messageService: MessageService;
  private userSessions: UserSessions = {};
  private isPolling = false;
  private config: BotConfig;

  constructor(config: BotConfig) {
    this.config = config;

    // Initialize core services
    this.telegramService = new TelegramService(config.telegramToken);
    this.chatGPTService = new ChatGPTService(config);

    // Initialize weather service (BMKG tidak memerlukan API key)
    this.weatherService = new WeatherService();

    // Initialize workout reminder service
    this.workoutReminderService = new WorkoutReminderService(
      (userId: number, message: string, parseMode) =>
        this.telegramService.sendMessage(userId, message, parseMode)
    );

    // Initialize command service
    this.commandService = new CommandService(
      this.telegramService,
      this.chatGPTService,
      this.userSessions,
      this.weatherService
    );

    // Initialize message service
    this.messageService = new MessageService(
      this.telegramService,
      this.chatGPTService,
      this.commandService,
      this.userSessions
    );
  }

  async start(): Promise<void> {
    console.log('🤖 Starting AI Telegram Chatbot...');
    
    // Test bot connection
    try {
      const botInfo = await this.telegramService.getBotInfo();
      console.log(`✅ Bot connected: @${botInfo.username} (${botInfo.first_name})`);
    } catch (error) {
      console.error('❌ Failed to connect to Telegram:', error);
      process.exit(1);
    }

    // Start long polling
    this.startPolling();
    console.log('🔄 Long polling started...');
    
    // Auto start workout reminder if configured
    await this.autoStartWorkoutReminder();
    
    // Log available services
    this.logAvailableServices();
  }

  private async autoStartWorkoutReminder(): Promise<void> {
    if (!this.workoutReminderService) {
      console.log('⚠️ Workout reminder service not available - skipping auto start');
      return;
    }

    if (!this.config.reminderUserId) {
      console.log('⚠️ REMINDER_USER_ID not configured - skipping auto start reminder');
      return;
    }

    try {
      console.log('🏃‍♂️ Auto starting workout reminder...');
      
      // Check if reminder is already active
      if (this.workoutReminderService.isReminderActive()) {
        console.log('✅ Workout reminder already active');
        return;
      }

      // Start the reminder with configured settings
      this.workoutReminderService.startWeekendReminder(
        this.config.reminderUserId,
        this.config.reminderTime || '17:00',
        this.config.reminderTimezone || 'Asia/Jakarta',
        'id' // Default to Indonesian
      );

      console.log(`✅ Auto started workout reminder for user ${this.config.reminderUserId}`);
      console.log(`📅 Schedule: Every Saturday at ${this.config.reminderTime} (${this.config.reminderTimezone})`);
      console.log(`📍 Location: ${this.config.cityName}, ${this.config.countryCode}`);
      
    } catch (error) {
      console.error('❌ Failed to auto start workout reminder:', error);
    }
  }

  private startPolling(): void {
    if (this.isPolling) {
      console.log('⚠️ Polling already running');
      return;
    }

    this.isPolling = true;
    this.poll();
  }

  private async poll(): Promise<void> {
    while (this.isPolling) {
      try {
        const updates = await this.telegramService.getUpdates();
        
        for (const update of updates) {
          if (update.message?.text && update.message.from && update.message.chat) {
            await this.processUpdate(update);
          }
        }
      } catch (error) {
        console.error('❌ Error during polling:', error);
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }
  }

  private async processUpdate(update: TelegramUpdate): Promise<void> {
    const message = update.message;
    
    if (!message?.text || !message.from || !message.chat) {
      return;
    }
    
    const chatId = message.chat.id;
    const text = message.text;
    const user = message.from;
    const userId = user.id;

    console.log(`📨 Message from ${user.first_name || 'Unknown'} (${userId}): ${text}`);

    try {
      await this.messageService.processMessage(chatId, text, user);
    } catch (error) {
      console.error('❌ Error processing message:', error);
      
      try {
        await this.telegramService.sendMessage(
          chatId,
          '❌ Maaf, terjadi kesalahan saat memproses pesan Anda. Silakan coba lagi.'
        );
      } catch (sendError) {
        console.error('❌ Error sending error message:', sendError);
      }
    }
  }

  private logAvailableServices(): void {
    console.log('\n📋 Available Services:');
    console.log('✅ Telegram Bot API');
    console.log('✅ ChatGPT Integration');
    
    if (this.weatherService) {
      console.log('✅ Weather Service (OpenWeatherMap)');
    } else {
      console.log('❌ Weather Service (No API key)');
    }
    
    if (this.workoutReminderService) {
      console.log('✅ Workout Reminder Service');
    } else {
      console.log('❌ Workout Reminder Service (Weather service required)');
    }
    
    console.log('\n🚀 Bot is ready to receive messages!');
    console.log('💡 Try: /start, /help, /ai, or ask about weather/workout\n');
  }

  stop(): void {
    console.log('🛑 Stopping bot...');
    this.isPolling = false;
    
    if (this.workoutReminderService) {
      this.workoutReminderService.stopReminder();
    }
    
    console.log('✅ Bot stopped');
  }

  // Getter methods for accessing services (if needed for testing or external use)
  getTelegramService(): TelegramService {
    return this.telegramService;
  }

  getChatGPTService(): ChatGPTService {
    return this.chatGPTService;
  }

  getWeatherService(): WeatherService | null {
    return this.weatherService;
  }

  getWorkoutReminderService(): WorkoutReminderService | null {
    return this.workoutReminderService;
  }

  getUserSessions(): UserSessions {
    return this.userSessions;
  }
}
