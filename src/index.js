// Подключаем библиотеку для работы с Telegram API
const TelegramBot = require('node-telegram-bot-api');
// Подключаем express для создания веб-сервера
const express = require('express');
// Подключаем dotenv для загрузки переменных окружения
require('dotenv').config();

// Получаем токен бота из переменной окружения
const BOT_TOKEN = process.env.BOT_TOKEN;
// Получаем URL веб-приложения из переменной окружения
const FRONTEND_URL = process.env.FRONTEND_URL;
// Указываем внешний URL сервера, на который будет установлен вебхук (домен или IP с портом)
const BOT_WEBHOOK_BASE_URL = process.env.BOT_WEBHOOK_BASE_URL;
// Задаем порт, на котором будет работать сервер внутри контейнера
const BOT_PORT = process.env.BOT_PORT;
// Получаем имя бота из переменной окружения
const BOT_USERNAME = process.env.BOT_USERNAME;
// Получаем переменную окружения для определения среды (продакшн или тест)
const NODE_ENV = process.env.NODE_ENV || 'development'; // 'production' или 'development'

let bot;
let app;

// Если продакшн — включаем вебхук, иначе запускаем поллинг
if (NODE_ENV === 'production') {
  console.log('🔹 Запуск в режиме ПРОДАКШЕН (вебхук)');

  // Создаем экземпляр Express-сервера
  app = express();
  // Указываем Express обрабатывать JSON-запросы от Telegram
  app.use(express.json());

  // Создаем экземпляр бота (без поллинга, так как используем вебхуки)
  bot = new TelegramBot(BOT_TOKEN);

  // Настраиваем маршрут для получения обновлений от Telegram
  app.post(`/bot${BOT_TOKEN}`, (req, res) => {
    // Передаем обновления боту для обработки
    bot.processUpdate(req.body);
    // Отправляем Telegram подтверждение (200 OK)
    res.sendStatus(200);
  });

  // Устанавливаем вебхук при запуске
  bot.setWebHook(`${BOT_WEBHOOK_BASE_URL}/bot${BOT_TOKEN}`).then(() => {
    // Логируем успешную установку вебхука
    console.log(`✅ Вебхук установлен на ${BOT_WEBHOOK_BASE_URL}/bot${BOT_TOKEN}`);
  }).catch((error) => {
    // Логируем ошибку установки вебхука
    console.error('❌ Ошибка установки вебхука:', error);
  });

  // Запускаем сервер на указанном порту
  app.listen(BOT_PORT, () => {
    // Логируем запуск сервера
    console.log(`🚀 Сервер запущен на порту ${BOT_PORT}`);
  });

} else {
  console.log('🔹 Запуск в режиме РАЗРАБОТКИ (поллинг)');

  // Создаем экземпляр бота с включенным поллингом
  bot = new TelegramBot(BOT_TOKEN, { polling: true });
}

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
      await bot.sendMessage(chatId, 'Привет, тут ты увидишь много разных энчиков! Жми на кнопку ниже!', {
        reply_markup: {
          inline_keyboard: [
            // Кнопка с текстом "Мини-Приложение" и ссылкой на Web App
            [{ text: 'Открыть Топ энергетиков', web_app: { url: FRONTEND_URL } }]
          ]
        }
      });
    } catch (error) {
      // Логируем ошибку, если отправка не удалась
      console.error('Ошибка отправки сообщения:', error);
    }
  }
});
