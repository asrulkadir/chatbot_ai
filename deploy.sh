#!/bin/bash

# AI Chatbot Telegram - VPS Deployment Script
# Usage: ./deploy.sh

echo "🚀 Starting AI Chatbot Telegram Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    print_error "PM2 is not installed. Installing PM2..."
    npm install -g pm2
    if [ $? -eq 0 ]; then
        print_success "PM2 installed successfully"
    else
        print_error "Failed to install PM2"
        exit 1
    fi
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    print_warning ".env file not found. Please create .env file with required environment variables."
    print_warning "Check .env.example for reference."
    exit 1
fi

# Install dependencies
print_status "Installing dependencies..."
npm install
if [ $? -ne 0 ]; then
    print_error "Failed to install dependencies"
    exit 1
fi
    # Build the project
print_status "Building TypeScript project..."
npm run build
if [ $? -ne 0 ]; then
    print_error "Build failed"
    exit 1
fi

# Check if app is already running
if pm2 list | grep -q "ai-chatbot-telegram"; then
    print_status "App is already running. Reloading..."
    npm run pm2:reload
else
    print_status "Starting new PM2 process..."
    npm run pm2:start
fi

# Show PM2 status
print_status "PM2 Process Status:"
pm2 status

# Show logs command
print_success "Deployment completed!"
print_status "Useful commands:"
echo "  📊 Check status: npm run pm2:status"
echo "  📋 View logs: npm run pm2:logs"
echo "  🔄 Restart: npm run pm2:restart"
echo "  🛑 Stop: npm run pm2:stop"
echo "  ❌ Delete: npm run pm2:delete"

print_status "Bot is now running in production mode with PM2!"
print_status "Check logs with: pm2 logs ai-chatbot-telegram"

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
