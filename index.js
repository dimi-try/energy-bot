const TelegramBot = require('node-telegram-bot-api');  // Библиотека для работы с Telegram API
const express = require('express');                    // Express для создания сервера
const bodyParser = require('body-parser');             // Для обработки JSON данных
const fetch = require('node-fetch');                   // Для отправки HTTP-запросов
require('dotenv').config();                            // Для работы с переменными окружения из .env файла

// Получаем значения из переменных окружения
const TOKEN = process.env.TOKEN;                       // Токен бота, который получаем от BotFather
const WEB_APP_URL = process.env.WEB_APP_URL;           // URL фронтенда для кнопки в Telegram
const WEBHOOK_URL = process.env.WEBHOOK_URL;           // URL для вебхука (публичный доступ к серверу)

// Создаем экземпляр бота, но не используем polling, а настроим вебхук
const bot = new TelegramBot(TOKEN);

// Создаем сервер с помощью Express
const app = express();
app.use(bodyParser.json());  // Используем body-parser для обработки входящих JSON данных от Telegram

// Функция для установки вебхука с помощью Telegram API
async function setWebhook() {
  // Формируем URL для установки вебхука в Telegram API
  const url = `https://api.telegram.org/bot${TOKEN}/setWebhook?url=${WEBHOOK_URL}`;
  
  try {
    // Отправляем запрос на установку вебхука
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.ok) {
      console.log('Webhook успешно установлен');
    } else {
      console.log('Ошибка при установке вебхука:', data.description);
    }
  } catch (err) {
    console.error('Ошибка при подключении к Telegram API:', err);
  }
}

// Обрабатываем входящие сообщения через вебхук
app.post('/webhook', async (req, res) => {
  // Получаем данные из запроса, который прислал Telegram
  const msg = req.body;
  
  const chatId = msg.message.chat.id;  // ID чата, куда бот будет отправлять сообщение
  const text = msg.message.text;       // Текст сообщения, которое пришло от пользователя

  // Если сообщение равно "/start", отправляем приветственное сообщение
  if (text === "/start") {
    await bot.sendMessage(chatId, 'Привет, тут ты увидишь много разных энчиков! Жми на ссылку ниже!', {
      reply_markup: {
        inline_keyboard: [
          [{ text: 'Открыть Топ энергетиков', web_app: { url: WEB_APP_URL } }]  // Кнопка с ссылкой на фронтенд
        ]
      }
    });
  }

  // Отправляем ответ Telegram, чтобы он знал, что запрос обработан
  res.send('OK');
});

// Устанавливаем вебхук при старте сервера
setWebhook();

// Запускаем сервер
const PORT = process.env.PORT || 8080;  // Указываем порт для сервера, по умолчанию 8080
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);  // Лог для проверки, что сервер запустился
});
