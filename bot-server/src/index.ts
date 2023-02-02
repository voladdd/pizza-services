import { App, ExpressReceiver } from "@slack/bolt";
import { Order } from "./utils";
import * as dotenv from "dotenv";
dotenv.config();

let order: Order;

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
      text: "Кавабанга! 🍕🍕🍕 \n Для того, чтобы заказать пиццу используй пример формы в сообщении ниже.",
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
            text: " */order-create* \nНазвание -  \nРазмер - \nТесто - \nБортик - \nДобавки - \nАдрес доставки - \nКомментарий к заказу - ",
          },
        },
        {
          type: "divider",
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: " *Пример заказа* \n\n  */order-create* \nНазвание - Пепперони фреш \nРазмер - 30 см\nТесто - традиционное тесто\nБортик - сырный\nДобавки - сочные ананасы\nАдрес доставки - Ул. Есенина, Дом Каруселина \nКомментарий к заказу - Жду, жду, жду",
          },
        },
      ],
    });
  } catch (error) {
    console.log("err");
    console.error(error);
  }
});

app.command("/order-create", async ({ command, ack, say, client }) => {
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
    const userProfile = await client.users.profile.get({
      user: command.user_id,
    });

    order = new Order(
      command.text,
      command.channel_id,
      command.user_name,
      userProfile.profile.image_512
    );

    console.log(order.getOrderInfo());
  } catch (error) {
    console.log("err");
    console.error(error);
  }
});

app.command("/order-save", async ({ command, ack, say }) => {
  try {
    await ack();
    await say({
      text: "Заказ оформлен и передан менеджеру.",
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "Ура! Заказ оформлен и передан менеджеру.",
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
