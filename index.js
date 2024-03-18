const dotenv = require("dotenv");
const TelegramBot = require("node-telegram-bot-api");
const API = require("./api");
const createXLS = require("./createXLS");
const formatDate = require("./formatDate");

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
      return bot.sendMessage(chatId, "Введи никнейм канала на Youtube");
    }
    if (msg.text.includes("/")) {
      console.log("user entered incorrectly >>", msg.text);
      return bot.sendMessage(chatId, "Неправильный ввод");
    }

    const username = msg.text;
    console.log("user entered >>", username);
    await bot.sendMessage(chatId, "Генерирую документ Excel");
    const channelId = await API.getChannelId(username, googleApiKey);
    const videosList = await API.getVideosList(channelId, googleApiKey);

    const xlsBuffer = await createXLS(videosList, username);
    const formattedDate = formatDate();
    const xlsFileOptions = {
      filename: `${username}_${formattedDate}.xls`,
      contentType: 'application/vnd.ms-excel',
    };
    return bot.sendDocument(chatId, xlsBuffer, undefined, xlsFileOptions);

  } catch (error) {
    console.error(error.stack);
    return bot.sendMessage(chatId, `Произошла ошибка: ${error.message}`);
  }
});
