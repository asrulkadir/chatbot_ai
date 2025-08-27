import type { ChatGPTService } from './chatGPTService';
import type { CommandService } from './commandService';
import { formatUserName } from './utils';
import type { TelegramService } from './telegramService';
import type { UserSessions } from './types';

export class MessageService {
  private telegramService: TelegramService;
  private chatGPTService: ChatGPTService;
  private commandService: CommandService;
  private userSessions: UserSessions;

  constructor(
    telegramService: TelegramService,
    chatGPTService: ChatGPTService,
    commandService: CommandService,
    userSessions: UserSessions,
  ) {
    this.telegramService = telegramService;
    this.chatGPTService = chatGPTService;
    this.commandService = commandService;
    this.userSessions = userSessions;
  }

  async processMessage(
    chatId: number,
    text: string,
    user: { id: number; first_name?: string; last_name?: string; username?: string }
  ): Promise<void> {
    const userId = user.id;
    const userName = formatUserName(user.first_name, user.last_name, user.username);

    // Initialize user session if not exists
    if (!this.userSessions[userId]) {
      this.userSessions[userId] = { aiMode: false };
    }

    this.userSessions[userId].lastActivity = new Date();

    // Handle commands
    if (text.startsWith('/')) {
      await this.handleCommand(chatId, userId, text);
      return;
    }

    // Handle weather queries automatically
    if (this.isWeatherQuery(text)) {
      await this.commandService.handleWeatherCommand(chatId);
      return;
    }

    // Handle workout queries automatically
    if (this.isWorkoutQuery(text)) {
      await this.commandService.handleWorkoutCommand(chatId);
      return;
    }

    // Check if AI mode is enabled
    if (this.userSessions[userId].aiMode) {
      await this.handleAIMessage(chatId, userId, text, userName);
    } else {
      await this.handleRegularMessage(chatId, text);
    }
  }

  private async handleCommand(chatId: number, userId: number, command: string): Promise<void> {
    const cmd = command.toLowerCase().split(' ')[0];

    switch (cmd) {
      case '/start':
        await this.commandService.handleStartCommand(chatId);
        break;
      case '/help':
        await this.commandService.handleHelpCommand(chatId);
        break;
      case '/clear':
        await this.commandService.handleClearCommand(chatId, userId);
        break;
      case '/ai':
        await this.commandService.handleAICommand(chatId, userId);
        break;
      case '/ai_off':
        await this.commandService.handleAIOffCommand(chatId, userId);
        break;
      case '/weather':
        await this.commandService.handleWeatherCommand(chatId);
        break;
      case '/workout':
        await this.commandService.handleWorkoutCommand(chatId);
        break;
      case '/reminder':
        await this.commandService.handleReminderCommand(chatId, userId);
        break;
      case '/stop_reminder':
        await this.commandService.handleStopReminderCommand(chatId);
        break;
      default:
        await this.telegramService.sendMessage(
          chatId,
          '❓ Perintah tidak dikenali. Ketik /help untuk melihat daftar perintah yang tersedia.'
        );
    }
  }

  private async handleAIMessage(
    chatId: number,
    userId: number,
    text: string,
    _userName: string
  ): Promise<void> {
    try {
      await this.telegramService.sendChatAction(chatId, 'typing');
      
      const response = await this.chatGPTService.getChatResponse(text, userId);
      await this.telegramService.sendMessage(chatId, response);
    } catch (error) {
      console.error('Error handling AI message:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('quota')) {
          await this.telegramService.sendMessage(
            chatId,
            '⚠️ *Quota OpenAI terlampaui*\n\nMaaf, quota penggunaan OpenAI sudah habis untuk bulan ini. Silakan coba lagi bulan depan atau hubungi administrator.',
            'Markdown'
          );
        } else if (error.message.includes('timeout') || error.message.includes('network')) {
          await this.telegramService.sendMessage(
            chatId,
            '⚠️ Koneksi ke ChatGPT bermasalah. Silakan coba lagi dalam beberapa saat.'
          );
        } else {
          await this.telegramService.sendMessage(
            chatId,
            '❌ Maaf, terjadi kesalahan saat memproses pesan. Silakan coba lagi.'
          );
        }
      } else {
        await this.telegramService.sendMessage(
          chatId,
          '❌ Terjadi kesalahan yang tidak terduga. Silakan coba lagi.'
        );
      }
    }
  }

  private async handleRegularMessage(chatId: number, _text: string): Promise<void> {
    const responses = [
      '🤖 Halo! Saya adalah AI chatbot. Aktifkan mode AI dengan /ai untuk chat dengan ChatGPT.',
      '💡 Tip: Ketik /ai untuk mengaktifkan mode ChatGPT, atau tanya tentang cuaca/workout untuk info otomatis.',
      '📝 Pesan Anda diterima! Gunakan /ai untuk chat AI atau /help untuk bantuan.',
      '🔔 Mode AI sedang nonaktif. Ketik /ai untuk mengaktifkan ChatGPT atau /weather untuk cek cuaca.'
    ];

    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    await this.telegramService.sendMessage(chatId, randomResponse);
  }

  private isWeatherQuery(text: string): boolean {
    const weatherKeywords = [
      'cuaca', 'weather', 'panas', 'dingin', 'hujan', 'cerah', 'mendung',
      'suhu', 'temperature', 'kelembaban', 'humidity', 'angin', 'wind'
    ];
    
    const lowerText = text.toLowerCase();
    return weatherKeywords.some(keyword => lowerText.includes(keyword));
  }

  private isWorkoutQuery(text: string): boolean {
    const workoutKeywords = [
      'olahraga', 'workout', 'exercise', 'gym', 'fitness', 'lari', 'running',
      'senam', 'yoga', 'jogging', 'sport', 'latihan', 'training'
    ];
    
    const lowerText = text.toLowerCase();
    return workoutKeywords.some(keyword => lowerText.includes(keyword));
  }
}
