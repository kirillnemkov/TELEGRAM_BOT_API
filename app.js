const qs = require("qs");
const telegramAPI = require("node-telegram-bot-api");
const token = "1723937055:AAEv_Zw0hWeH48Mbr5THIr4ueu_YtkCe0mI";
const bot = new telegramAPI(token, { polling: true });
const fetch = require("node-fetch");

bot.setMyCommands([
  { command: "/start", description: "Приветствие" },
  { command: "/sovet", description: "Получить совет" },
  { command: "/kiska", description: "Показать киску" },
]);

bot.on("message", async (msg) => {
  const text = msg.text;
  const chatId = msg.chat.id;
  const userName = msg.from.first_name;

  if (text === "/start") {
    bot.sendMessage(chatId, `Привет ${userName}, познакомимся?`);
  }
  if (text === "/kiska") {
    const response = await fetch("https://api.thecatapi.com/v1/images/search", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const parsedResponse = await response.json();
    const url = parsedResponse[0].url;
    bot.sendMessage(chatId, url);
  }
  if (text === "/sovet") {
    const response = await fetch("https://api.adviceslip.com/advice", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const parsedResponse = await response.json();
    const {
      slip: { advice },
    } = parsedResponse;
    const res = await fetch(
      "https://google-translate1.p.rapidapi.com/language/translate/v2",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "accept-encoding": "application/gzip",
          "x-rapidapi-key":
            "146174e235mshe349045d8dc9ad8p102087jsncaeff8278d3d",
          "x-rapidapi-host": "google-translate1.p.rapidapi.com",
        },
        body: qs.stringify({
          q: advice,
          target: "ru",
          source: "en",
        }),
      }
    );
    const parseResponse = await res.json();
    const answer = parseResponse.data.translations[0].translatedText;
    bot.sendMessage(chatId, `Лови советик ====> ${answer}`);
  }
});
