#!/bin/bash

echo "🤖 Setup AI Chatbot Telegram"
echo "==============================="

# Check if .env exists
if [ ! -f .env ]; then
    echo "📄 Membuat file .env dari template..."
    cp .env.example .env
    echo "✅ File .env berhasil dibuat"
else
    echo "⚠️ File .env sudah ada"
fi

echo ""
echo "📝 Silakan edit file .env dan isi:"
echo "   - TELEGRAM_BOT_TOKEN (dari @BotFather)"
echo "   - OPENAI_API_KEY (dari OpenAI Platform)"
echo ""
echo "🚀 Setelah itu jalankan: npm run dev"
echo ""
echo "📚 Baca README.md untuk instruksi lengkap"
