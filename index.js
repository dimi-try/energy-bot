const TelegramBot = require('node-telegram-bot-api');  // Библиотека для работы с Telegram API
const fetch = require('node-fetch');                   // Для отправки HTTP-запросов
require('dotenv').config();                            // Загружаем переменные окружения

// Получаем токен и вебхук URL из окружения
const TOKEN = process.env.TOKEN;
const WEB_APP_URL = process.env.WEB_APP_URL;  // Фронтенд
const WEBHOOK_URL = process.env.WEBHOOK_URL;  // Вебхук (Render)

// Создаем бота с поддержкой вебхука
const bot = new TelegramBot(TOKEN, { webHook: true });

// Устанавливаем вебхук
async function setWebhook() {
  try {
    await bot.setWebHook(WEBHOOK_URL);
    console.log('✅ Webhook установлен на:', WEBHOOK_URL);
  } catch (err) {
    console.error('❌ Ошибка при установке вебхука:', err);
  }
}

// Обрабатываем сообщения
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (text === "/start") {
    await bot.sendMessage(chatId, 'Привет, тут ты увидишь много разных энчиков! Жми на ссылку ниже!', {
      reply_markup: {
        inline_keyboard: [
          [{ text: 'Открыть Топ энергетиков', web_app: { url: WEB_APP_URL } }]  // Кнопка с фронтом
        ]
      }
    });
  }
});

// Вызываем установку вебхука
setWebhook();
