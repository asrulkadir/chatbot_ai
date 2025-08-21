import * as dotenv from 'dotenv';
import { loadConfig } from './utils';

dotenv.config();

async function testConfig() {
  try {
    console.log('🧪 Testing configuration...');
    
    const config = loadConfig();
    
    console.log('✅ Configuration loaded successfully:');
    console.log(`   - Telegram Token: ${config.telegramToken.substring(0, 10)}...`);
    console.log(`   - OpenAI Key: ${config.openaiApiKey.substring(0, 10)}...`);
    console.log(`   - Model: ${config.openaiModel}`);
    console.log(`   - Max Tokens: ${config.maxTokens}`);
    console.log(`   - Temperature: ${config.temperature}`);
    
    console.log('\n🚀 Configuration is valid! You can now run the bot.');
    
  } catch (error) {
    console.error('❌ Configuration error:', error);
    console.log('\n📝 Please check your .env file and make sure all required variables are set.');
    process.exit(1);
  }
}

if (require.main === module) {
  testConfig();
}
