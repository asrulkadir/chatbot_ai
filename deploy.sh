#!/bin/bash

echo "🚀 Deploying AI Chatbot Telegram"
echo "================================="

# Build the project
echo "📦 Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "✅ Build completed successfully"

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ .env file not found!"
    echo "Please create .env file with your tokens"
    exit 1
fi

# Test configuration
echo "🧪 Testing configuration..."
npm run test-config

if [ $? -ne 0 ]; then
    echo "❌ Configuration test failed!"
    exit 1
fi

echo "✅ Configuration is valid"

# Start the bot
echo "🤖 Starting bot..."
npm start
