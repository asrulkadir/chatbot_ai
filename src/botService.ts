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

  constructor(config: BotConfig) {
    
    // Initialize core services
    this.telegramService = new TelegramService(config.telegramToken);
    this.chatGPTService = new ChatGPTService(config);
    
    // Initialize weather service if API key is available
    this.weatherService = config.openweatherApiKey 
      ? new WeatherService(config.openweatherApiKey)
      : null;
    
    // Initialize workout reminder service if weather service is available
    this.workoutReminderService = this.weatherService 
      ? new WorkoutReminderService(
          (userId: number, message: string) => this.telegramService.sendMessage(userId, message),
          config.openweatherApiKey
        )
      : null;

    // Initialize command service
    this.commandService = new CommandService(
      this.telegramService,
      this.chatGPTService,
      config,
      this.userSessions,
      this.weatherService || undefined,
      this.workoutReminderService || undefined
    );

    // Initialize message service
    this.messageService = new MessageService(
      this.telegramService,
      this.chatGPTService,
      this.commandService,
      this.userSessions,
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
    
    // Log available services
    this.logAvailableServices();
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
