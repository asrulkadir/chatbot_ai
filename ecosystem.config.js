module.exports = {
  apps: [
    {
      name: 'ai-chatbot-telegram',
      script: 'dist/main.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      // Error and log configuration
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      time: true,
      
      // Auto restart configuration
      min_uptime: '10s',
      max_restarts: 10,
      
      // Advanced PM2 features
      exec_mode: 'fork',
      
      // Environment variables (akan di-override oleh .env file)
      env_file: '.env',
      
      // Source map support for better error tracking
      source_map_support: true,
      
      // Instance configuration
      merge_logs: true,
      
      // Health check
      health_check_grace_period: 3000,
      
      // Graceful shutdown
      kill_timeout: 5000,
      listen_timeout: 3000,
      
      // Node.js specific options
      node_args: '--max-old-space-size=512'
    }
  ],

  // Deployment configuration (optional)
  deploy: {
    production: {
      user: 'ubuntu', // ganti dengan username VPS Anda
      host: 'your-vps-ip', // ganti dengan IP VPS Anda
      ref: 'origin/main',
      repo: 'https://github.com/asrulkadir/chatbot_ai.git',
      path: '/home/ubuntu/chatbot_ai',
      'pre-deploy-local': '',
      'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};
