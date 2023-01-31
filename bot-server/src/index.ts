import { App, ExpressReceiver } from "@slack/bolt";
import * as dotenv from "dotenv";
dotenv.config();

const receiver = new ExpressReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

const app = new App({
  receiver,
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  appToken: process.env.APP_TOKEN,
});

(async () => {
  const port = process.env.PORT || 3000;
  await app.start(port);
  console.log(`⚡️ Slack Bolt app is running on port ${port}!`);
})();

app.command("/order-help", async ({ ack, say }) => {
  try {
    await ack();
    await say({
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "Кавабанга! 🍕🍕🍕 \n Для того, чтобы заказать пиццу используй пример формы в сообщении ниже. Скопируй, заполни, и отправь мне!",
          },
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: " */order-create* \n 1. Название -  \n2. Размер - \n3. Тесто - \n4. Бортик - \n5. Добавки - \n6. Адрес доставки - \n7. Комментарий к заказу - ",
          },
        },
        {
          type: "divider",
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: " *Пример заказа* \n\n  */order-create* \n 1. Название - Пепперони фреш \n2. Размер - 30 см\n3. Тесто - традиционное тесто\n4. Бортик - сырный\n5. Добавки - сочные ананасы\n6. Адрес доставки - Ул. Есенина, Дом Каруселина \n7. Комментарий к заказу - Жду, жду, жду",
          },
        },
      ],
    });
  } catch (error) {
    console.log("err");
    console.error(error);
  }
});

app.command("/order-create", async ({ command, ack, say }) => {
  try {
    await ack();
    await say({
      text: "Записал!",
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "Записал! Подтверди пожалуйста свой заказ с помощью комманды */order-save*",
          },
        },
      ],
    });
    console.log(command.text);
  } catch (error) {
    console.log("err");
    console.error(error);
  }
});

app.command("/order-save", async ({ command, ack, say }) => {
  try {
    await ack();
    await say({
      text: "Записал!",
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "Записал! Подтверди пожалуйста свой заказ с помощью комманды */order-save*",
          },
        },
      ],
    });
    console.log(command.text);
  } catch (error) {
    console.log("err");
    console.error(error);
  }
});

receiver.router.get("/secret-page", (req, res) => {
  // You're working with an express req and res now.
  res.send("yay!");
});

// app.client.chat.postMessage({
//     channel: "D04M4PWUHT7",
//     text: "Hello all",
//   });
