import type { ChatGPTService } from './chatGPTService';
import type { CommandService } from './commandService';
import { formatUserName, detectLanguage } from './utils';
import { getMessages } from './messages';
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
    const detectedLanguage = detectLanguage(text);

    this.userSessions[userId] = {
      aiMode: false,
      language: detectedLanguage
    };

    this.userSessions[userId].lastActivity = new Date();

    // Handle commands
    if (text.startsWith('/')) {
      await this.handleCommand(chatId, userId, text);
      return;
    }

    // Handle weather queries automatically
    if (this.isWeatherQuery(text)) {
      await this.commandService.handleWeatherCommand(chatId, userId);
      return;
    }

    // Handle workout queries automatically
    if (this.isWorkoutQuery(text)) {
      await this.commandService.handleWorkoutCommand(chatId, userId);
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
        await this.commandService.handleStartCommand(chatId, userId);
        break;
      case '/help':
        await this.commandService.handleHelpCommand(chatId, userId);
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
        await this.commandService.handleWeatherCommand(chatId, userId);
        break;
      case '/workout':
        await this.commandService.handleWorkoutCommand(chatId, userId);
        break;
      case '/reminder':
        await this.commandService.handleReminderCommand(chatId, userId);
        break;
      case '/stop_reminder':
        await this.commandService.handleStopReminderCommand(chatId, userId);
        break;
      default: {
        const language = this.userSessions[userId]?.language || 'en';
        const msg = getMessages(language);
        await this.telegramService.sendMessage(
          chatId,
          msg.messages.unknownCommand
        );
        break;
      }
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
      
      const language = this.userSessions[userId]?.language || 'en';
      const msg = getMessages(language);
      
      if (error instanceof Error) {
        if (error.message.includes('quota')) {
          await this.telegramService.sendMessage(
            chatId,
            msg.messages.quotaExceeded,
            'Markdown'
          );
        } else if (error.message.includes('timeout') || error.message.includes('network')) {
          await this.telegramService.sendMessage(
            chatId,
            msg.messages.connectionError
          );
        } else {
          await this.telegramService.sendMessage(
            chatId,
            msg.messages.generalError
          );
        }
      } else {
        await this.telegramService.sendMessage(
          chatId,
          msg.messages.unexpectedError
        );
      }
    }
  }

  private async handleRegularMessage(chatId: number, _text: string): Promise<void> {
    const userId = Object.keys(this.userSessions).find(id => {
      const session = this.userSessions[parseInt(id, 10)];
      return session?.lastActivity && 
        Date.now() - session.lastActivity.getTime() < 60000;
    });
    
    const language = userId ? this.userSessions[parseInt(userId, 10)].language : 'en';
    const msg = getMessages(language);
    
    const responses = [
      msg.botResponses.aiModeOff1,
      msg.botResponses.aiModeOff2,
      msg.botResponses.aiModeOff3,
      msg.botResponses.aiModeOff4
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
