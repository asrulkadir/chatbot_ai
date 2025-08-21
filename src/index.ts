import TelegramBot from 'node-telegram-bot-api';
import { OpenAI } from 'openai';
import * as dotenv from 'dotenv';
import type { ChatHistory, ChatMessage } from './types';
import { loadConfig, formatUserName, truncateText } from './utils';

// Load environment variables
dotenv.config();

// Load configuration
const config = loadConfig();

// Inisialisasi bot Telegram
const bot = new TelegramBot(config.telegramToken, { polling: true });

// Inisialisasi OpenAI
const openai = new OpenAI({
  apiKey: config.openaiApiKey,
});

// Menyimpan history chat per user untuk konteks percakapan
const chatHistory: ChatHistory = {};

// Function untuk mendapatkan respons dari ChatGPT
async function getChatGPTResponse(message: string, userId: number): Promise<string> {
  try {
    // Inisialisasi history chat jika belum ada
    if (!chatHistory[userId]) {
      chatHistory[userId] = [];
    }

    // Tambahkan pesan user ke history
    chatHistory[userId].push({ role: 'user', content: message });

    // Batasi history chat agar tidak terlalu panjang (maksimal 10 percakapan terakhir)
    if (chatHistory[userId].length > 20) {
      chatHistory[userId] = chatHistory[userId].slice(-20);
    }

    // Buat system message untuk memberikan konteks ke ChatGPT
    const systemMessage = {
      role: 'system' as const,
      content: 'Kamu adalah asisten AI yang ramah dan membantu. Jawab pertanyaan dengan bahasa Indonesia yang natural dan informatif.'
    };

    // Gabungkan system message dengan history chat
    const messages = [systemMessage, ...chatHistory[userId]];

    // Panggil OpenAI API
    const completion = await openai.chat.completions.create({
      model: config.openaiModel,
      messages: messages,
      max_tokens: config.maxTokens,
      temperature: config.temperature,
    });

    const response = completion.choices[0]?.message?.content || 'Maaf, saya tidak bisa memproses permintaan Anda saat ini.';

    // Tambahkan respons assistant ke history
    chatHistory[userId].push({ role: 'assistant', content: response });

    return response;
  } catch (error) {
    console.error('Error mendapatkan respons ChatGPT:', error);
    return 'Maaf, terjadi kesalahan saat memproses permintaan Anda. Silakan coba lagi nanti.';
  }
}

// Handler untuk pesan text
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from?.id || chatId;
  const messageText = msg.text;

  // Abaikan pesan yang bukan text atau pesan dari bot
  if (!messageText || msg.from?.is_bot) {
    return;
  }

  console.log(`Pesan dari ${formatUserName(msg.from?.first_name, msg.from?.last_name, msg.from?.username)} (${userId}): ${messageText}`);

  try {
    // Kirim indikator typing
    await bot.sendChatAction(chatId, 'typing');

    // Dapatkan respons dari ChatGPT
    const response = await getChatGPTResponse(messageText, userId);

    // Kirim respons ke user
    await bot.sendMessage(chatId, response);

    console.log(`Respons terkirim ke ${formatUserName(msg.from?.first_name, msg.from?.last_name, msg.from?.username)}: ${truncateText(response)}`);
  } catch (error) {
    console.error('Error mengirim pesan:', error);
    await bot.sendMessage(chatId, 'Maaf, terjadi kesalahan teknis. Silakan coba lagi nanti.');
  }
});

// Handler untuk command /start
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const welcomeMessage = `
🤖 *Selamat datang di AI Chatbot!*

Halo! Saya adalah chatbot AI yang didukung oleh ChatGPT. Saya siap membantu Anda dengan berbagai pertanyaan dan percakapan.

*Cara menggunakan:*
• Kirim pesan apa saja dan saya akan merespons
• Saya dapat membantu dengan informasi, saran, atau sekadar mengobrol
• Ketik /clear untuk menghapus history percakapan
• Ketik /help untuk melihat bantuan

Silakan mulai percakapan dengan mengirim pesan!
  `;

  await bot.sendMessage(chatId, welcomeMessage, { parse_mode: 'Markdown' });
});

// Handler untuk command /help
bot.onText(/\/help/, async (msg) => {
  const chatId = msg.chat.id;
  const helpMessage = `
📋 *Bantuan AI Chatbot*

*Perintah yang tersedia:*
• /start - Memulai percakapan
• /help - Menampilkan bantuan ini
• /clear - Menghapus history percakapan

*Fitur:*
• 💬 Percakapan natural dengan AI
• 🧠 Menyimpan konteks percakapan
• 🌍 Mendukung bahasa Indonesia
• ⚡ Respons cepat dan akurat

*Tips:*
• Ajukan pertanyaan dengan jelas
• Saya dapat membantu dengan berbagai topik
• History percakapan akan tersimpan selama sesi

Mulai percakapan dengan mengirim pesan apa saja!
  `;

  await bot.sendMessage(chatId, helpMessage, { parse_mode: 'Markdown' });
});

// Handler untuk command /clear
bot.onText(/\/clear/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from?.id || chatId;

  // Hapus history chat user
  if (chatHistory[userId]) {
    delete chatHistory[userId];
  }

  await bot.sendMessage(chatId, '🗑️ History percakapan telah dihapus. Silakan mulai percakapan baru!');
});

// Error handling untuk bot
bot.on('polling_error', (error) => {
  console.error('Polling error:', error);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Menghentikan bot...');
  bot.stopPolling();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('Menghentikan bot...');
  bot.stopPolling();
  process.exit(0);
});

console.log('🤖 AI Chatbot Telegram telah dimulai!');
console.log('Bot sedang berjalan dan siap menerima pesan...');
