const TelegramBot = require('node-telegram-bot-api');  // Библиотека для работы с Telegram API
const express = require('express');                    // Express для создания сервера
const bodyParser = require('body-parser');             // Для обработки JSON данных
const fetch = require('node-fetch');                   // Для отправки HTTP-запросов
require('dotenv').config();                            // Для работы с переменными окружения из .env файла

// Получаем значения из переменных окружения
const TOKEN = process.env.TOKEN;                       // Токен бота, который получаем от BotFather
const WEB_APP_URL = process.env.WEB_APP_URL;           // URL фронтенда для кнопки в Telegram
const WEBHOOK_URL = process.env.WEBHOOK_URL;           // URL для вебхука (публичный доступ к серверу)

// Создаем экземпляр бота с настройкой вебхука (без polling)
const bot = new TelegramBot(TOKEN, { webHook: { port: process.env.PORT || 8080 } });

// Создаем сервер с помощью Express
const app = express();
app.use(bodyParser.json());  // Используем body-parser для обработки входящих JSON данных от Telegram

// Функция для установки вебхука с помощью Telegram API
async function setWebhook() {
  try {
    await bot.setWebHook(WEBHOOK_URL); // Устанавливаем вебхук
    console.log('Webhook успешно установлен');
  } catch (err) {
    console.error('Ошибка при установке вебхука:', err);
  }
}

// Обрабатываем входящие сообщения через вебхук
app.post('/webhook', async (req, res) => {
  bot.processUpdate(req.body); // Передаем полученные данные боту для обработки
  res.sendStatus(200); // Telegram должен получить 200 OK
});

// Обработчик сообщений от Telegram
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (text === "/start") {
    await bot.sendMessage(chatId, 'Привет, тут ты увидишь много разных энчиков! Жми на ссылку ниже!', {
      reply_markup: {
        inline_keyboard: [
          [{ text: 'Открыть Топ энергетиков', web_app: { url: WEB_APP_URL } }]  // Кнопка с ссылкой на фронтенд
        ]
      }
    });
  }
});

// Устанавливаем вебхук при старте сервера
setWebhook();

// Запускаем сервер Express
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
