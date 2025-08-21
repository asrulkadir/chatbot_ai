# AI Chatbot Telegram dengan ChatGPT

Bot Telegram yang terintegrasi dengan ChatGPT menggunakan Node.js dan TypeScript.

## 🚀 Fitur

- ✅ Integrasi penuh dengan ChatGPT (OpenAI API)
- ✅ Menyimpan history percakapan untuk konteks yang lebih baik
- ✅ Mendukung bahasa Indonesia
- ✅ Command yang mudah digunakan
- ✅ Error handling yang robust
- ✅ TypeScript untuk type safety

## 📋 Prasyarat

1. **Node.js** (versi 16 atau lebih tinggi)
2. **npm** atau **yarn**
3. **Bot Telegram Token** - Dapatkan dari [@BotFather](https://t.me/botfather)
4. **OpenAI API Key** - Dapatkan dari [OpenAI Platform](https://platform.openai.com/api-keys)

## 🛠️ Instalasi

1. Clone repository ini:
   ```bash
   git clone <repository-url>
   cd ai-chatbot-telegram
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy file environment:
   ```bash
   cp .env.example .env
   ```

4. Edit file `.env` dan isi dengan token Anda:
   ```env
   TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
   OPENAI_API_KEY=your_openai_api_key_here
   
   # Optional configuration
   OPENAI_MODEL=gpt-3.5-turbo
   MAX_TOKENS=1000
   TEMPERATURE=0.7
   ```

## 🎯 Cara Mendapatkan Token

### Telegram Bot Token

1. Buka Telegram dan cari [@BotFather](https://t.me/botfather)
2. Kirim perintah `/newbot`
3. Ikuti instruksi untuk memberi nama bot Anda
4. Salin token yang diberikan dan masukkan ke file `.env`

### OpenAI API Key

1. Kunjungi [OpenAI Platform](https://platform.openai.com/)
2. Daftar atau login ke akun Anda
3. Buka halaman [API Keys](https://platform.openai.com/api-keys)
4. Klik "Create new secret key"
5. Salin API key dan masukkan ke file `.env`

## 🚀 Menjalankan Bot

### Quick Setup
```bash
npm run setup
```

### Test Konfigurasi
```bash
npm run test-config
```

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm run build
npm start
```

## 📱 Command Bot

- `/start` - Memulai percakapan dengan bot
- `/help` - Menampilkan bantuan dan informasi
- `/clear` - Menghapus history percakapan

## �️ Scripts Tersedia

| Script | Deskripsi |
|--------|-----------|
| `npm run setup` | Setup awal project (membuat .env) |
| `npm run test-config` | Test validitas konfigurasi |
| `npm run dev` | Jalankan bot dalam mode development |
| `npm run build` | Compile TypeScript ke JavaScript |
| `npm start` | Jalankan bot dalam mode production |
| `npm run watch` | Watch mode untuk development |
| `npm run clean` | Hapus folder dist |
| `npm run lint` | Check TypeScript tanpa compile |
| `./setup.sh` | Setup script bash |
| `./deploy.sh` | Deploy script untuk production |

## �🔧 Konfigurasi

Anda dapat menyesuaikan perilaku ChatGPT dengan mengubah variabel di file `.env`:

- `OPENAI_MODEL`: Model yang digunakan (default: gpt-3.5-turbo)
- `MAX_TOKENS`: Maksimal token untuk respons (default: 1000)
- `TEMPERATURE`: Kreativitas respons 0-1 (default: 0.7)

## 📁 Struktur Project

```
ai-chatbot-telegram/
├── src/
│   ├── index.ts          # File utama bot
│   ├── types.ts          # Type definitions
│   ├── utils.ts          # Utility functions
│   └── test-config.ts    # Test konfigurasi
├── dist/                 # Compiled JavaScript (auto-generated)
├── .vscode/              # VS Code configuration
│   ├── launch.json       # Debug configuration
│   └── extensions.json   # Recommended extensions
├── .env.example          # Template environment variables
├── .env                  # Environment variables (buat manual)
├── package.json          # Dependencies dan scripts
├── tsconfig.json         # TypeScript configuration
├── setup.sh              # Setup script
└── README.md            # Dokumentasi ini
```

## 🛡️ Keamanan

- Jangan pernah commit file `.env` ke repository
- Simpan API key dengan aman
- Gunakan environment variables untuk konfigurasi sensitif

## 🐛 Troubleshooting

### Bot tidak merespons
- Pastikan token Telegram sudah benar
- Cek koneksi internet
- Lihat log error di console

### Error OpenAI
- Pastikan API key OpenAI valid dan memiliki credit
- Cek quota API limit
- Pastikan model yang digunakan tersedia

### TypeScript errors
- Jalankan `npm run build` untuk melihat error detail
- Pastikan semua dependencies terinstall

## 📄 License

MIT License - silakan gunakan untuk proyek pribadi atau komersial.

## 🤝 Kontribusi

Kontribusi sangat diterima! Silakan:

1. Fork repository ini
2. Buat branch feature baru
3. Commit perubahan Anda
4. Push ke branch
5. Buat Pull Request

## 📞 Support

Jika ada pertanyaan atau masalah, silakan buat issue di repository ini.
