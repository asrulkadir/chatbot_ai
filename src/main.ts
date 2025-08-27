import * as dotenv from 'dotenv';
import { BotService } from './botService';
import { loadConfig } from './utils';

// Load environment variables
dotenv.config();

async function main(): Promise<void> {
  try {
    // Load configuration
    const config = loadConfig();
    
    // Create and start bot
    const bot = new BotService(config);
    await bot.start();
    
    // Handle graceful shutdown
    process.on('SIGINT', () => {
      console.log('\n🛑 Received SIGINT. Shutting down gracefully...');
      bot.stop();
      process.exit(0);
    });
    
    process.on('SIGTERM', () => {
      console.log('\n🛑 Received SIGTERM. Shutting down gracefully...');
      bot.stop();
      process.exit(0);
    });
    
  } catch (error) {
    console.error('❌ Failed to start bot:', error);
    process.exit(1);
  }
}

// Start the bot
main().catch((error) => {
  console.error('❌ Unhandled error:', error);
  process.exit(1);
});
