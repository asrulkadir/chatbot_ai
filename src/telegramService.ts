// Interface for Telegram API responses
export interface TelegramUser {
  id: number;
  is_bot: boolean;
  first_name: string;
  last_name?: string;
  username?: string;
}

export interface TelegramChat {
  id: number;
  type: string;
}

export interface TelegramMessage {
  message_id: number;
  from?: TelegramUser;
  chat: TelegramChat;
  date: number;
  text?: string;
}

export interface TelegramUpdate {
  update_id: number;
  message?: TelegramMessage;
}

export class TelegramService {
  private apiUrl: string;
  private lastUpdateId = 0;

  constructor(botToken: string) {
    this.apiUrl = `https://api.telegram.org/bot${botToken}`;
  }

  async callAPI(method: string, params: Record<string, unknown> = {}): Promise<unknown> {
    try {
      const url = `${this.apiUrl}/${method}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      const data = await response.json();
      
      if (!data.ok) {
        throw new Error(`Telegram API error: ${data.description}`);
      }

      return data.result;
    } catch (error) {
      console.error(`Error calling Telegram API method ${method}:`, error);
      throw error;
    }
  }

  async sendMessage(chatId: number, text: string, parseMode?: string): Promise<void> {
    const params: Record<string, unknown> = {
      chat_id: chatId,
      text: text,
    };

    if (parseMode) {
      params.parse_mode = parseMode;
    }

    await this.callAPI('sendMessage', params);
  }

  async sendChatAction(chatId: number, action: string): Promise<void> {
    await this.callAPI('sendChatAction', {
      chat_id: chatId,
      action: action,
    });
  }

  async getUpdates(): Promise<TelegramUpdate[]> {
    const params = {
      offset: this.lastUpdateId + 1,
      timeout: 30, // Long polling timeout
      allowed_updates: ['message'],
    };

    const updates = await this.callAPI('getUpdates', params) as TelegramUpdate[];
    
    if (updates.length > 0) {
      this.lastUpdateId = updates[updates.length - 1].update_id;
    }

    return updates;
  }

  async getBotInfo(): Promise<{ username: string; first_name: string }> {
    return await this.callAPI('getMe') as { username: string; first_name: string };
  }
}
