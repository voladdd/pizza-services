import { App } from "@slack/bolt";
import * as dotenv from "dotenv";
dotenv.config();

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.APP_TOKEN,
});

(async () => {
  const port = process.env.PORT || 3000;
  await app.start(port);
  console.log(`⚡️ Slack Bolt app is running on port ${port}!`);
})();

//commands to make
//order-help
//order-create
//order-save

app.command("/order-help", async ({ ack, say }) => {
  try {
    await ack();
    say({
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
            text: " */order-pizza* \n 1. Название -  \n2. Размер - \n3. Тесто - \n4. Бортик - \n5. Добавки - \n6. Адрес доставки - \n7. Комментарий к заказу - ",
          },
        },
        {
          type: "divider",
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: " *Пример заказа* \n\n  */order-pizza* \n 1. Название - Пепперони фреш \n2. Размер - 30 см\n3. Тесто - традиционное тесто\n4. Бортик - сырный\n5. Добавки - сочные ананасы\n6. Адрес доставки - Ул. Есенина, Дом Каруселина \n7. Комментарий к заказу - Жду, жду, жду",
          },
        },
      ],
    });
  } catch (error) {
    console.log("err");
    console.error(error);
  }
});

// app.client.chat.postMessage({
//   channel: "D04M4PWUHT7",
//   text: "Hello all",
// });
