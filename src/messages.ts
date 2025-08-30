export interface Messages {
  welcome: {
    title: string;
    description: string;
    usage: string;
    aiMode: string;
    aiOff: string;
    weather: string;
    help: string;
    start: string;
  };
  help: {
    title: string;
    commands: string;
    features: string;
    tips: string;
    aiActivation: string;
    weatherAuto: string;
    reminders: string;
    startMessage: string;
  };
  commands: {
    start: string;
    help: string;
    clear: string;
    ai: string;
    aiOff: string;
    weather: string;
    workout: string;
  };
  messages: {
    historyCleared: string;
    aiModeEnabled: string;
    aiModeDisabled: string;
    weatherUnavailable: string;
    weatherError: string;
    workoutError: string;
    reminderEnabled: string;
    reminderAlreadyActive: string;
    reminderStopped: string;
    reminderNotActive: string;
    reminderError: string;
    quotaExceeded: string;
    connectionError: string;
    generalError: string;
    unknownCommand: string;
    unexpectedError: string;
    aiDefaultResponse: string;
  };
  botResponses: {
    aiModeOff1: string;
    aiModeOff2: string;
    aiModeOff3: string;
    aiModeOff4: string;
  };
  weather: {
    currentWeather: string;
    location: string;
    condition: string;
    temperature: string;
    humidity: string;
    windSpeed: string;
    visibility: string;
    time: string;
    dataSource: string;
    goodForWorkout: string;
    notGoodForWorkout: string;
    recommendations: string;
    indoorAlternatives: string;
    useProperClothing: string;
    stayHydrated: string;
    warmUp: string;
    chooseRightTime: string;
    homeWorkout: string;
    yoga: string;
    dance: string;
    shadowBoxing: string;
    keepSpirit: string;
    enjoyWorkout: string;
    errors: {
      fetchFailed: string;
    };
    conditions: {
      perfectForJogging: string;
      notPerfectForJogging: string;
      rainy: string;
      thunderstorm: string;
      tooCold: string;
      tooHot: string;
      highHumidity: string;
      strongWind: string;
    };
  };
  reminder: {
    weekendTime: string;
    location: string;
    timezone: string;
    weatherCheck: string;
    stopInstruction: string;
    saturdayGreeting: string;
    goodWeatherGreeting: string;
    badWeatherGreeting: string;
    weatherCheckError: string;
  };
  workoutReminder: {
    weekendTitle: string;
    weekendTitleGoodWeather: string;
    weekendTitleBadWeather: string;
    joggingTips: string;
    indoorAlternatives: string;
    basicReminder: {
      title: string;
      greeting: string;
      dontForget: string;
      warmUp: string;
      stayHydrated: string;
      comfortableShoes: string;
      enjoyWorkout: string;
    };
    goodWeather: {
      greeting: string;
      tipsTitle: string;
      weatherClothing: string;
      bringWater: string;
      warmUpCoolDown: string;
      chooseRoute: string;
      letsStart: string;
    };
    badWeather: {
      greeting: string;
      alternativesTitle: string;
      homeWorkout: string;
      yoga: string;
      danceWorkout: string;
      shadowBoxing: string;
      activeGames: string;
      keepSpirit: string;
    };
    fallback: {
      title: string;
      greeting: string;
      weatherError: string;
      suggestions: string;
      checkWeather: string;
      sunnyActivity: string;
      rainyActivity: string;
      enjoy: string;
    };
  };
}

export const messages: Record<string, Messages> = {
  id: {
    welcome: {
      title: '🤖 Selamat datang di AI Chatbot!',
      description:
        'Halo! Saya adalah chatbot AI yang didukung oleh ChatGPT. Saya siap membantu Anda dengan berbagai pertanyaan dan percakapan.',
      usage: 'Cara menggunakan:',
      aiMode: '• Ketik /ai untuk mengaktifkan mode AI ChatGPT',
      aiOff: '• Ketik /ai_off untuk menonaktifkan mode AI',
      weather: '• Tanya tentang cuaca atau workout untuk info otomatis',
      help: '• Ketik /help untuk melihat bantuan',
      start: 'Silakan mulai percakapan dengan mengirim pesan!',
    },
    help: {
      title: '📋 Bantuan AI Chatbot',
      commands: 'Perintah yang tersedia:',
      features: 'Fitur:',
      tips: 'Tips:',
      aiActivation: '• Aktifkan mode AI dengan /ai untuk chat dengan ChatGPT',
      weatherAuto: "• Tanya tentang 'cuaca' atau 'workout' untuk info otomatis",
      reminders: '• Pengingat olahraga berjalan otomatis setiap Sabtu',
      startMessage: 'Mulai percakapan dengan mengirim pesan apa saja!',
    },
    commands: {
      start: '• /start - Memulai percakapan',
      help: '• /help - Menampilkan bantuan ini',
      clear: '• /clear - Menghapus history percakapan',
      ai: '• /ai - Aktifkan mode AI ChatGPT',
      aiOff: '• /ai_off - Nonaktifkan mode AI ChatGPT',
      weather: '• /weather - Cek cuaca saat ini',
      workout: '• /workout - Cek cuaca untuk olahraga',
    },
    messages: {
      historyCleared:
        '🗑️ History percakapan telah dihapus. Silakan mulai percakapan baru!',
      aiModeEnabled:
        '🤖 Mode AI ChatGPT diaktifkan!\n\nSekarang semua pesan Anda akan diproses oleh ChatGPT. Ketik /ai_off untuk menonaktifkan.',
      aiModeDisabled:
        '🚫 Mode AI ChatGPT dinonaktifkan!\n\nSekarang bot akan merespons hanya untuk command khusus dan query cuaca/workout.',
      weatherUnavailable:
        '❌ Layanan cuaca tidak tersedia. API key cuaca belum dikonfigurasi.',
      weatherError:
        '❌ Maaf, tidak bisa mengambil data cuaca saat ini. Silakan coba lagi nanti.',
      workoutError:
        '❌ Maaf, tidak bisa mengecek cuaca untuk olahraga saat ini. Silakan coba lagi nanti.',
      reminderEnabled: '🏃‍♂️ *Pengingat Olahraga Diaktifkan!*',
      reminderAlreadyActive:
        '✅ Pengingat olahraga sudah aktif! Anda akan mendapat pengingat setiap hari Sabtu.',
      reminderStopped: '🛑 Pengingat olahraga telah dihentikan.',
      reminderNotActive: '⚠️ Pengingat olahraga tidak sedang aktif.',
      reminderError: '❌ Gagal mengatur pengingat. Silakan coba lagi nanti.',
      quotaExceeded:
        '⚠️ *Quota OpenAI terlampaui*\n\nMaaf, quota penggunaan OpenAI sudah habis untuk bulan ini. Silakan coba lagi bulan depan atau hubungi administrator.',
      connectionError:
        '⚠️ Koneksi ke ChatGPT bermasalah. Silakan coba lagi dalam beberapa saat.',
      generalError:
        '❌ Maaf, terjadi kesalahan saat memproses pesan. Silakan coba lagi.',
      unknownCommand:
        '❓ Perintah tidak dikenali. Ketik /help untuk melihat daftar perintah yang tersedia.',
      unexpectedError:
        '❌ Terjadi kesalahan yang tidak terduga. Silakan coba lagi.',
      aiDefaultResponse:
        'Maaf, saya tidak bisa memproses permintaan Anda saat ini. Silakan coba lagi nanti.',
    },
    botResponses: {
      aiModeOff1:
        '🤖 Halo! Saya adalah AI chatbot. Aktifkan mode AI dengan /ai untuk chat dengan ChatGPT.',
      aiModeOff2:
        '💡 Tip: Ketik /ai untuk mengaktifkan mode ChatGPT, atau tanya tentang cuaca/workout untuk info otomatis.',
      aiModeOff3:
        '📝 Pesan Anda diterima! Gunakan /ai untuk chat AI atau /help untuk bantuan.',
      aiModeOff4:
        '🔔 Mode AI sedang nonaktif. Ketik /ai untuk mengaktifkan ChatGPT atau /weather untuk cek cuaca.',
    },
    weather: {
      currentWeather: 'Cuaca Saat Ini',
      location: '📍 *Lokasi:*',
      condition: '*Kondisi:*',
      temperature: '🌡️ *Suhu:*',
      humidity: '💧 *Kelembapan:*',
      windSpeed: '🌪️ *Kecepatan Angin:*',
      visibility: '👁️ *Visibilitas:*',
      time: '🕒 *Waktu:*',
      dataSource: '_Data diambil dari BMKG_',
      goodForWorkout: '🏃‍♂️ Cuaca Bagus untuk Olahraga!',
      notGoodForWorkout: '🏠 Cuaca Kurang Ideal untuk Olahraga Outdoor',
      recommendations: 'Rekomendasi:',
      indoorAlternatives: 'Alternatif olahraga indoor:',
      useProperClothing: '• Gunakan pakaian olahraga yang sesuai',
      stayHydrated: '• Jangan lupa minum air yang cukup',
      warmUp: '• Lakukan pemanasan sebelum olahraga',
      chooseRightTime: '• Pilih waktu yang tepat untuk berolahraga',
      homeWorkout: '• 🏋️‍♂️ Workout di rumah',
      yoga: '• 🧘‍♀️ Yoga atau stretching',
      dance: '• 💃 Dance workout',
      shadowBoxing: '• 🥊 Shadow boxing',
      keepSpirit: 'Tetap semangat berolahraga! 💪',
      enjoyWorkout: 'Selamat berolahraga! 💪🔥',
      errors: {
        fetchFailed: 'Gagal mengambil data cuaca',
      },
      conditions: {
        perfectForJogging: 'Cuaca sangat bagus untuk jogging!',
        notPerfectForJogging: 'Cuaca kurang ideal untuk jogging',
        rainy: 'Sedang hujan, lebih baik olahraga di dalam ruangan',
        thunderstorm: 'Ada badai petir, tidak aman untuk olahraga outdoor',
        tooCold: 'Cuaca terlalu dingin untuk jogging',
        tooHot: 'Cuaca terlalu panas, lebih baik olahraga sore hari',
        highHumidity:
          'Kelembaban sangat tinggi, mungkin tidak nyaman untuk jogging',
        strongWind: 'Angin terlalu kencang untuk jogging',
      },
    },
    reminder: {
      weekendTime:
        '✅ Anda akan mendapat pengingat olahraga setiap *hari Sabtu* jam',
      location: '📍 Lokasi cuaca:',
      timezone: '🕐 Timezone:',
      weatherCheck:
        'Bot akan mengecek cuaca terlebih dahulu dan memberikan rekomendasi olahraga yang sesuai.',
      stopInstruction: 'Gunakan /stop_reminder untuk menghentikan pengingat.',
      saturdayGreeting: 'Halo! Ini hari Sabtu, saatnya berolahraga! 💪',
      goodWeatherGreeting:
        'Halo! Ini hari Sabtu dan cuaca sedang bagus untuk jogging!',
      badWeatherGreeting: 'Halo! Ini hari Sabtu, tapi...',
      weatherCheckError:
        'Maaf, tidak bisa mengecek cuaca saat ini. Tapi jangan biarkan itu menghentikan semangat olahraga Anda!',
    },
    workoutReminder: {
      weekendTitle: '🏃‍♂️ *Pengingat Olahraga Weekend!*',
      weekendTitleGoodWeather: '🏃‍♂️ *Pengingat Olahraga Weekend!*',
      weekendTitleBadWeather: '🏠 *Pengingat Olahraga Weekend!*',
      joggingTips: '*Tips untuk jogging hari ini:*',
      indoorAlternatives: '*Alternatif olahraga indoor:*',
      basicReminder: {
        title: '🏃‍♂️ *Pengingat Olahraga Weekend!*',
        greeting: 'Halo! Ini hari Sabtu, saatnya berolahraga! 💪',
        dontForget: 'Jangan lupa untuk:',
        warmUp: '• Pemanasan sebelum olahraga',
        stayHydrated: '• Minum air yang cukup',
        comfortableShoes: '• Gunakan sepatu olahraga yang nyaman',
        enjoyWorkout: 'Selamat berolahraga! 🔥',
      },
      goodWeather: {
        greeting: 'Halo! Ini hari Sabtu dan cuaca sedang bagus untuk jogging!',
        tipsTitle: '*Tips untuk jogging hari ini:*',
        weatherClothing: '• Gunakan pakaian yang sesuai dengan cuaca',
        bringWater: '• Bawa botol air minum',
        warmUpCoolDown: '• Jangan lupa pemanasan dan pendinginan',
        chooseRoute: '• Pilih rute yang aman dan nyaman',
        letsStart: 'Yuk mulai jogging! 🏃‍♂️💨',
      },
      badWeather: {
        greeting:
          'Halo! Ini hari Sabtu, tapi cuaca tidak mendukung untuk jogging.',
        alternativesTitle: '*Alternatif olahraga indoor:*',
        homeWorkout: '• 🏋️‍♂️ Workout di rumah (push up, sit up, squat)',
        yoga: '• 🧘‍♀️ Yoga atau stretching',
        danceWorkout: '• 💃 Dance workout dengan musik favoritmu',
        shadowBoxing: '• 🥊 Shadow boxing atau martial arts',
        activeGames: '• 🎯 Bermain game aktif di rumah',
        keepSpirit: 'Tetap semangat berolahraga! 💪🔥',
      },
      fallback: {
        title: '🏃‍♂️ *Pengingat Olahraga Weekend!*',
        greeting: 'Halo! Ini hari Sabtu, saatnya berolahraga! 💪',
        weatherError:
          'Maaf, tidak bisa mengecek cuaca saat ini. Tapi jangan biarkan itu menghentikan semangat olahraga Anda!',
        suggestions: '*Saran olahraga:*',
        checkWeather: '• Cek cuaca di luar dulu',
        sunnyActivity: '• Jika cerah, jogging atau bersepeda',
        rainyActivity: '• Jika hujan, workout di dalam rumah',
        enjoy: 'Selamat berolahraga! 🔥',
      },
    },
  },
  en: {
    welcome: {
      title: '🤖 Welcome to AI Chatbot!',
      description:
        "Hello! I am an AI chatbot powered by ChatGPT. I'm ready to help you with various questions and conversations.",
      usage: 'How to use:',
      aiMode: '• Type /ai to enable AI ChatGPT mode',
      aiOff: '• Type /ai_off to disable AI mode',
      weather: '• Ask about weather or workout for automatic info',
      help: '• Type /help to see help',
      start: 'Please start the conversation by sending a message!',
    },
    help: {
      title: '📋 AI Chatbot Help',
      commands: 'Available commands:',
      features: 'Features:',
      tips: 'Tips:',
      aiActivation: '• Enable AI mode with /ai to chat with ChatGPT',
      weatherAuto: "• Ask about 'weather' or 'workout' for automatic info",
      reminders: '• Workout reminders run automatically every Saturday',
      startMessage: 'Start conversation by sending any message!',
    },
    commands: {
      start: '• /start - Start conversation',
      help: '• /help - Show this help',
      clear: '• /clear - Clear conversation history',
      ai: '• /ai - Enable AI ChatGPT mode',
      aiOff: '• /ai_off - Disable AI ChatGPT mode',
      weather: '• /weather - Check current weather',
      workout: '• /workout - Check weather for workout',
    },
    messages: {
      historyCleared:
        '🗑️ Conversation history has been cleared. Please start a new conversation!',
      aiModeEnabled:
        '🤖 AI ChatGPT mode enabled!\n\nNow all your messages will be processed by ChatGPT. Type /ai_off to disable.',
      aiModeDisabled:
        '🚫 AI ChatGPT mode disabled!\n\nNow the bot will only respond to specific commands and weather/workout queries.',
      weatherUnavailable:
        '❌ Weather service is not available. Weather API key is not configured.',
      weatherError:
        "❌ Sorry, couldn't get weather data right now. Please try again later.",
      workoutError:
        "❌ Sorry, couldn't check weather for workout right now. Please try again later.",
      reminderEnabled: '🏃‍♂️ *Workout Reminder Enabled!*',
      reminderAlreadyActive:
        '✅ Workout reminder is already active! You will get reminders every Saturday.',
      reminderStopped: '🛑 Workout reminder has been stopped.',
      reminderNotActive: '⚠️ Workout reminder is not currently active.',
      reminderError: '❌ Failed to set up reminder. Please try again later.',
      quotaExceeded:
        '⚠️ *OpenAI quota exceeded*\n\nSorry, OpenAI usage quota has been exhausted for this month. Please try again next month or contact administrator.',
      connectionError:
        '⚠️ Connection to ChatGPT is having issues. Please try again in a moment.',
      generalError:
        '❌ Sorry, an error occurred while processing the message. Please try again.',
      unknownCommand:
        '❓ Command not recognized. Type /help to see available commands.',
      unexpectedError: '❌ An unexpected error occurred. Please try again.',
      aiDefaultResponse:
        "Sorry, I can't process your request right now. Please try again later.",
    },
    botResponses: {
      aiModeOff1:
        "🤖 Hello! I'm an AI chatbot. Enable AI mode with /ai to chat with ChatGPT.",
      aiModeOff2:
        '💡 Tip: Type /ai to enable ChatGPT mode, or ask about weather/workout for automatic info.',
      aiModeOff3:
        '📝 Your message received! Use /ai for AI chat or /help for assistance.',
      aiModeOff4:
        '🔔 AI mode is currently off. Type /ai to enable ChatGPT or /weather to check weather.',
    },
    weather: {
      currentWeather: '*Current Weather*',
      location: '📍 *Location:*',
      condition: '*Condition:*',
      temperature: '🌡️ *Temperature:*',
      humidity: '💧 *Humidity:*',
      windSpeed: '🌪️ *Wind Speed:*',
      visibility: '👁️ *Visibility:*',
      time: '🕒 *Time:*',
      dataSource: '_Data from BMKG_',
      goodForWorkout: '🏃‍♂️ *Great Weather for Workout!*',
      notGoodForWorkout: '🏠 *Weather Not Ideal for Outdoor Workout*',
      recommendations: '*Recommendations:*',
      indoorAlternatives: '*Indoor workout alternatives:*',
      useProperClothing: '• Use appropriate workout clothing',
      stayHydrated: "• Don't forget to stay hydrated",
      warmUp: '• Do warm-up before exercising',
      chooseRightTime: '• Choose the right time to exercise',
      homeWorkout: '• 🏋️‍♂️ Home workout',
      yoga: '• 🧘‍♀️ Yoga or stretching',
      dance: '• 💃 Dance workout',
      shadowBoxing: '• 🥊 Shadow boxing',
      keepSpirit: 'Keep up the exercise spirit! 💪',
      enjoyWorkout: 'Enjoy your workout! 💪🔥',
      errors: {
        fetchFailed: 'Failed to fetch weather data',
      },
      conditions: {
        perfectForJogging: 'Weather is perfect for jogging!',
        notPerfectForJogging: 'Weather is not ideal for jogging',
        rainy: "It's raining, better to exercise indoors",
        thunderstorm: 'Thunderstorm present, not safe for outdoor exercise',
        tooCold: 'Weather is too cold for jogging',
        tooHot: 'Weather is too hot, better to exercise in the evening',
        highHumidity: 'Very high humidity, might be uncomfortable for jogging',
        strongWind: 'Wind is too strong for jogging',
      },
    },
    reminder: {
      weekendTime: '✅ You will receive workout reminders every *Saturday* at',
      location: '📍 Weather location:',
      timezone: '🕐 Timezone:',
      weatherCheck:
        'Bot will check weather first and provide appropriate workout recommendations.',
      stopInstruction: 'Use /stop_reminder to stop reminders.',
      saturdayGreeting: "Hello! It's Saturday, time to exercise! 💪",
      goodWeatherGreeting:
        "Hello! It's Saturday and the weather is great for jogging!",
      badWeatherGreeting: "Hello! It's Saturday, but...",
      weatherCheckError:
        "Sorry, couldn't check weather right now. But don't let that stop your exercise spirit!",
    },
    workoutReminder: {
      weekendTitle: '🏃‍♂️ *Weekend Workout Reminder!*',
      weekendTitleGoodWeather: '🏃‍♂️ *Weekend Workout Reminder!*',
      weekendTitleBadWeather: '🏠 *Weekend Workout Reminder!*',
      joggingTips: "*Tips for today's jogging:*",
      indoorAlternatives: '*Indoor exercise alternatives:*',
      basicReminder: {
        title: '🏃‍♂️ *Weekend Workout Reminder!*',
        greeting: "Hello! It's Saturday, time to exercise! 💪",
        dontForget: "Don't forget to:",
        warmUp: '• Warm up before exercising',
        stayHydrated: '• Stay hydrated',
        comfortableShoes: '• Use comfortable sports shoes',
        enjoyWorkout: 'Enjoy your workout! 🔥',
      },
      goodWeather: {
        greeting: "Hello! It's Saturday and the weather is great for jogging!",
        tipsTitle: "*Tips for today's jogging:*",
        weatherClothing: '• Wear weather-appropriate clothing',
        bringWater: '• Bring a water bottle',
        warmUpCoolDown: "• Don't forget warm-up and cool-down",
        chooseRoute: '• Choose a safe and comfortable route',
        letsStart: "Let's start jogging! 🏃‍♂️💨",
      },
      badWeather: {
        greeting:
          "Hello! It's Saturday, but the weather isn't suitable for jogging.",
        alternativesTitle: '*Indoor exercise alternatives:*',
        homeWorkout: '• 🏋️‍♂️ Home workout (push ups, sit ups, squats)',
        yoga: '• 🧘‍♀️ Yoga or stretching',
        danceWorkout: '• 💃 Dance workout with your favorite music',
        shadowBoxing: '• 🥊 Shadow boxing or martial arts',
        activeGames: '• 🎯 Active games at home',
        keepSpirit: 'Keep up the exercise spirit! 💪🔥',
      },
      fallback: {
        title: '🏃‍♂️ *Weekend Workout Reminder!*',
        greeting: "Hello! It's Saturday, time to exercise! 💪",
        weatherError:
          "Sorry, couldn't check the weather right now. But don't let that stop your exercise spirit!",
        suggestions: '*Exercise suggestions:*',
        checkWeather: '• Check the weather outside first',
        sunnyActivity: '• If sunny, go jogging or cycling',
        rainyActivity: '• If raining, workout at home',
        enjoy: 'Enjoy your workout! 🔥',
      },
    },
  },
};

export function getMessages(language: string = 'id'): Messages {
  return messages[language] || messages.id;
}
