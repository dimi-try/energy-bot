// Подключаем библиотеку для работы с Telegram API
const TelegramBot = require('node-telegram-bot-api');
// Подключаем express для создания веб-сервера
const express = require('express');
// Подключаем dotenv для загрузки переменных окружения
require('dotenv').config();

// Получаем токен бота из переменной окружения
const TOKEN = process.env.TOKEN;
// Получаем URL веб-приложения из переменной окружения
const WEB_APP_URL = process.env.WEB_APP_URL;
// Указываем внешний URL вашего сервера (домен или IP с портом)
const SERVER_URL = process.env.SERVER_URL;
// Задаем порт, на котором будет работать сервер внутри контейнера
const PORT = process.env.PORT;
// Получаем имя бота из переменной окружения
const BOT_USERNAME = process.env.BOT_USERNAME;

// Создаем экземпляр Express-сервера
const app = express();
// Указываем Express обрабатывать JSON-запросы от Telegram
app.use(express.json());

// Создаем экземпляр бота (без поллинга, так как используем вебхуки)
const bot = new TelegramBot(TOKEN);

// Настраиваем маршрут для получения обновлений от Telegram
app.post(`/bot${TOKEN}`, (req, res) => {
  // Передаем обновления боту для обработки
  bot.processUpdate(req.body);
  // Отправляем Telegram подтверждение (200 OK)
  res.sendStatus(200);
});

// Функция проверки, есть ли бот в группе
async function isBotInChat(chatId) {
  try {
    const chatMember = await bot.getChatMember(chatId, bot.botInfo.id);
    return chatMember.status !== 'kicked' && chatMember.status !== 'left';
  } catch (error) {
    console.error('Ошибка при проверке бота в группе:', error);
    return false;
  }
}

// Обрабатываем входящие сообщения
bot.on('message', async (msg) => {
  // Извлекаем ID чата из сообщения
  const chatId = msg.chat.id;
  // Извлекаем текст сообщения
  const text = msg.text;

  // Проверяем, есть ли бот в группе
  if (msg.chat.type === 'group' || msg.chat.type === 'supergroup') {
    const inChat = await isBotInChat(chatId);
    if (!inChat) {
      console.log('Бот исключён из группы, игнорируем сообщение.');
      return;
    }
  }

  // Проверяем команду /start
  if (text === '/start') {
    try {
      // Отправляем приветственное сообщение с кнопкой
      await bot.sendMessage(chatId, 'Добро пожаловать в топ энергетиков!', {
        reply_markup: {
          inline_keyboard: [
            // Кнопка с текстом "Мини-Приложение" и ссылкой на Web App
            [{ text: 'Мини-Приложение', web_app: { url: WEB_APP_URL } }]
          ]
        }
      });
    } catch (error) {
      // Логируем ошибку, если отправка не удалась
      console.error('Ошибка отправки сообщения:', error);
    }
  }
  // Поддержка групп и супергрупп
  else if (msg.chat.type === 'group' || msg.chat.type === 'supergroup') {
    // Проверяем упоминание бота
    if (text.includes(`@${BOT_USERNAME}`)) {
      try {
        // Отправляем ответ на упоминание
        await bot.sendMessage(chatId, 'Я здесь! Как могу помочь? 🤖');
      } catch (error) {
        console.error('Ошибка при ответе на упоминание:', error);
      }
    }
    try {
      // Отправляем сообщение в группу
      await bot.sendMessage(chatId, 'Я работаю и в группах!');
    } catch (error) {
      // Логируем ошибку для групп
      console.error('Ошибка в группе:', error);
    }
  }
});

// Устанавливаем вебхук при запуске
bot.setWebHook(`${SERVER_URL}/bot${TOKEN}`).then(() => {
  // Логируем успешную установку вебхука
  console.log(`Вебхук установлен на ${SERVER_URL}/bot${TOKEN}`);
}).catch((error) => {
  // Логируем ошибку установки вебхука
  console.error('Ошибка установки вебхука:', error);
});

// Запускаем сервер на указанном порту
app.listen(PORT, () => {
  // Логируем запуск сервера
  console.log(`Сервер запущен на порту ${PORT}`);
});
