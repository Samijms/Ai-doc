const { Scenes, Markup } = require("telegraf");
const { Keyboard, Key } = require("telegram-keyboard");
const disease = require("./disease");

const keyboards = {
  sex: Keyboard.make([Key.callback("Male"), Key.callback("Female")]).inline(),
  category: Keyboard.make([
    [Key.callback("Rashes and skin infections")],
    [Key.callback("Diarrhea & Vomiting illnesses")],
    [Key.callback("Respiratory Infections")],
    [Key.callback("Other Infections")],
  ]).inline(),
  test: Keyboard.make(["Button 1", "Button 2"]).reply(),
};

const testScene = new Scenes.WizardScene(
  "TEST_SCENE",
  (ctx) => {
    ctx.reply("select Item", buildKeyboards("Diarrhea and Vomiting illnesses"));
    ctx.wizard.state.data = {};
    return ctx.wizard.next();
  },
  (ctx) => {
    ctx.deleteMessage();
    ctx.reply("How old are you?");
    console.log(ctx.update.callback_query.data);
    return ctx.wizard.next();
  }
);

const buildKeyboards = (category) => {
  let keyboard = [];
  for (let i = 0; i < disease.length; i++) {
    let diseaseData = disease[i];
    if (category === diseaseData.category) {
      console.log(diseaseData.symptom);
      keyboard.push([diseaseData.symptom]);
    }
  }
  return Keyboard.make(keyboard).inline();
};

const getData = (category) => {
  let data = "";
  for (let i = 0; i < disease.length; i++) {
    let diseaseData = disease[i];
    if (category === diseaseData.category) {
      data = diseaseData.result;
    }
  }
  return data;
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const userRegistrationScene = new Scenes.WizardScene(
  "ADD_USER",
  (ctx) => {
    ctx.reply("What is your full name?");
    ctx.wizard.state.user = {};
    return ctx.wizard.next();
  },
  (ctx) => {
    ctx.reply("How old are you?");
    ctx.wizard.state.user.fullName = ctx.message.text;
    return ctx.wizard.next();
  },
  (ctx) => {
    ctx.reply("Please select your sex?", keyboards.sex);
    ctx.wizard.state.user.age = ctx.message.text;
    return ctx.wizard.next();
  },
  (ctx) => {
    ctx.reply("What is your weight?");
    ctx.wizard.state.user.sex = ctx.update.callback_query.data;
    return ctx.wizard.next();
  },
  (ctx) => {
    ctx.reply("Please select the category", keyboards.category);
    ctx.wizard.state.user.weight = ctx.message.text;
    return ctx.wizard.next();
  },
  (ctx) => {
    ctx.deleteMessage();
    ctx.wizard.state.user.category = ctx.update.callback_query.data;
    const category = ctx.wizard.state.user.category;
    ctx.reply("Please select your symptom", buildKeyboards(category));
    return ctx.wizard.next();
  },
  async (ctx) => {
    ctx.deleteMessage();
    ctx.wizard.state.user.symptom = ctx.update.callback_query.data;
    var user = {
      ...ctx.wizard.state.user,
    };
    ctx.reply("Here is the result");
    await delay(2000);
    ctx.reply(getData(user.category));
  }
);

module.exports = { userRegistrationScene, testScene };
