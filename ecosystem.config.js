module.exports = {
  apps: [
    {
      name: 'ai-chatbot-telegram',
      script: 'dist/main.js',

      // Process management
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,

      // Environment
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      env_file: '.env',

      // Logging
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      merge_logs: true,
      time: true,

      // Auto restart (default: unlimited)
      min_uptime: '10s',

      // Health check & shutdown
      listen_timeout: 10000,
      health_check_grace_period: 10000,
      kill_timeout: 5000,

      // Source map support
      source_map_support: true,
    },
  ],

  // Deployment configuration (optional)
  deploy: {
    production: {
      user: 'ubuntu',
      host: 'your-vps-ip',
      ref: 'origin/main',
      repo: 'https://github.com/asrulkadir/chatbot_ai.git',
      path: '/home/ubuntu/chatbot_ai',
      'pre-deploy-local': '',
      'post-deploy':
        'npm install && npm run build && pm2 reload ecosystem.config.js --env production',
      'pre-setup': '',
    },
  },
};
