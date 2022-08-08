const { Telegraf, session, Scenes } = require("telegraf");
const { Keyboard } = require("telegram-keyboard");
const { userRegistrationScene, testScene } = require("./scene");
const express = require("express");
require("dotenv").config();

const bot = new Telegraf(process.env.BOT_TOKEN);

const stage = new Scenes.Stage([userRegistrationScene, testScene]);

const keyboards = {
  menu: Keyboard.make([["/Test"]]).reply(),
};

bot.start(async (ctx) => {
  ctx.reply(
    `Hello ${ctx.from.first_name}, Welcome to the bot!`,
    keyboards.menu
  );
});

stage.command("/Admin", (ctx) => {
  ctx.scene.enter("TEST_SCENE");
});

stage.command("/Test", (ctx) => {
  ctx.scene.enter("ADD_USER");
});

bot.use(session());
bot.use(stage.middleware());
bot.launch();

const app = express();
app.use(express.json());
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
