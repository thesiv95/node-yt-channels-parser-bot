const dotenv = require("dotenv");
const TelegramBot = require("node-telegram-bot-api");
const API = require("./api");
const pause = require("./pause");

dotenv.config();

const googleApiKey = process.env.GOOGLE_API_KEY;
const telegramApiKey = process.env.TELEGRAM_API_KEY;

if (!googleApiKey || !telegramApiKey) {
  console.error("api keys required");
  process.exit(1);
}

const bot = new TelegramBot(telegramApiKey, { polling: true });
console.log("bot runs");

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  try {
    if (msg.text === "/start") {
      return bot.sendMessage(chatId, "Введите никнейм канала на Youtube");
    }
    if (msg.text.includes("/")) {
      console.log("user entered incorrectly >>", msg.text);
      return bot.sendMessage(chatId, "Неправильный ввод");
    }

    const username = msg.text;
    console.log("user entered >>", username);
    const channelId = await API.getChannelId(username, googleApiKey);
    const videosList = await API.getVideosList(channelId, googleApiKey);

    for (let i = 0; i < videosList.length; i++) {
      await Promise.all([
        pause(),
        bot.sendMessage(chatId, videosList[i], { parse_mode: "HTML" }),
      ]);
    }
  } catch (error) {
    console.error(error.stack);
    return bot.sendMessage(chatId, error.message);
  }
});
