const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();

const TOKEN = process.env.TOKEN
const WEB_APP_URL = process.env.WEB_APP_URL
const bot = new TelegramBot(TOKEN, {polling: true});

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (text == "/start"){
    await bot.sendMessage(chatId, 'Hello', {
        reply_markup: {
            inline_keyboard: [
                [{text: 'Форма', web_app: {url: WEB_APP_URL}}]
            ]
        }
    })
  }
});