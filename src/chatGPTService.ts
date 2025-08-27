import { OpenAI } from 'openai';
import type { ChatHistory, ChatMessage, BotConfig } from './types';
import { getMessages } from './messages';

export class ChatGPTService {
  private openai: OpenAI;
  private config: BotConfig;
  private chatHistory: ChatHistory = {};

  constructor(config: BotConfig) {
    this.config = config;
    this.openai = new OpenAI({
      apiKey: config.openaiApiKey,
    });
  }

  async getChatResponse(message: string, userId: number, language: 'id' | 'en' = 'id'): Promise<string> {
    try {
      const messages = getMessages(language);
      
      // Inisialisasi history chat jika belum ada
      if (!this.chatHistory[userId]) {
        this.chatHistory[userId] = [];
      }

      // Tambahkan pesan user ke history
      this.chatHistory[userId].push({ role: 'user', content: message });

      // Batasi history chat agar tidak terlalu panjang (maksimal 20 percakapan terakhir)
      if (this.chatHistory[userId].length > 20) {
        this.chatHistory[userId] = this.chatHistory[userId].slice(-20);
      }

      // Buat system message sesuai bahasa yang dipilih
      const systemMessage: ChatMessage = {
        role: 'system',
        content: language === 'id' 
          ? 'Kamu adalah asisten AI yang ramah dan membantu. Jawab pertanyaan dengan bahasa Indonesia yang natural dan informatif. Gunakan emoji yang sesuai untuk membuat percakapan lebih menarik.'
          : 'You are a friendly and helpful AI assistant. Answer questions in natural and informative English. Use appropriate emojis to make conversations more engaging.'
      };

      // Gabungkan system message dengan history chat
      const chatMessages = [systemMessage, ...this.chatHistory[userId]];

      // Panggil OpenAI API
      const completion = await this.openai.chat.completions.create({
        model: this.config.openaiModel,
        messages: chatMessages,
        max_tokens: this.config.maxTokens,
        temperature: this.config.temperature,
      });

      const response = completion.choices[0]?.message?.content || messages.messages.aiDefaultResponse;

      // Tambahkan respons assistant ke history
      this.chatHistory[userId].push({ role: 'assistant', content: response });

      return response;
    } catch (error) {
      console.error('Error mendapatkan respons ChatGPT:', error);
      const messages = getMessages(language);
      
      // Handle specific OpenAI errors
      if (error instanceof Error) {
        if (error.message.includes('quota') || error.message.includes('billing')) {
          return messages.messages.quotaExceeded;
        }
        if (error.message.includes('timeout') || error.message.includes('network')) {
          return messages.messages.connectionError;
        }
      }
      
      return messages.messages.generalError;
    }
  }

  clearHistory(userId: number): void {
    if (this.chatHistory[userId]) {
      delete this.chatHistory[userId];
    }
  }

  getHistory(userId: number): ChatMessage[] {
    return this.chatHistory[userId] || [];
  }
}
