import { OpenAI } from 'openai';
import type { ChatHistory, ChatMessage, BotConfig } from './types';

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

  async getChatResponse(message: string, userId: number): Promise<string> {
    try {
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

      // Buat system message untuk memberikan konteks ke ChatGPT
      const systemMessage: ChatMessage = {
        role: 'system',
        content: 'Kamu adalah asisten AI yang ramah dan membantu. Jawab pertanyaan dengan bahasa Indonesia yang natural dan informatif.'
      };

      // Gabungkan system message dengan history chat
      const messages = [systemMessage, ...this.chatHistory[userId]];

      // Panggil OpenAI API
      const completion = await this.openai.chat.completions.create({
        model: this.config.openaiModel,
        messages: messages,
        max_tokens: this.config.maxTokens,
        temperature: this.config.temperature,
      });

      const response = completion.choices[0]?.message?.content || 'Maaf, saya tidak bisa memproses permintaan Anda saat ini.';

      // Tambahkan respons assistant ke history
      this.chatHistory[userId].push({ role: 'assistant', content: response });

      return response;
    } catch (error) {
      console.error('Error mendapatkan respons ChatGPT:', error);
      return 'Maaf, terjadi kesalahan saat memproses permintaan Anda. Silakan coba lagi nanti.';
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
