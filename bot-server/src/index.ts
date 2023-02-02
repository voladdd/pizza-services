import { App, ExpressReceiver } from "@slack/bolt";
import { Order } from "./utils";
import { MongoClient } from "mongodb";
import * as dotenv from "dotenv";
import bodyParser = require("body-parser");
dotenv.config();

//Mongo Setup
const client = new MongoClient(process.env.MONGO_URI);

async function insertOrderToDb(order: object) {
  try {
    const database = client.db("slack_bot_db");
    const orders = database.collection("orders_collection");
    const result = await orders.insertOne(order);
    console.log(`A document was inserted with the _id: ${result.insertedId}`);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

//Slack bot setup
let slackOrder: Order;

const receiver = new ExpressReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});
receiver.router.use(bodyParser.urlencoded({ extended: true }));
receiver.router.use(bodyParser.json());

const app = new App({
  receiver,
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  appToken: process.env.APP_TOKEN,
});

(async () => {
  const port = process.env.PORT || 3000;
  await app.start(port);
  // await run().catch(console.dir);

  console.log(`⚡️ Slack Bolt app is running on port ${port}!`);
})();

//Slack bot commands
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

    slackOrder = new Order(
      command.text,
      command.channel_id,
      command.user_name,
      userProfile.profile.image_512
    );

    console.log(slackOrder.getOrderInfo());
  } catch (error) {
    console.log("err");
    console.error(error);
  }
});

app.command("/order-save", async ({ command, ack, say }) => {
  try {
    await ack();
    await insertOrderToDb(slackOrder.getOrderInfo());
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
    await say({
      text: "При оформлении заказа произошла ошибка.",
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "При оформлении заказа произошла ошибка.",
          },
        },
      ],
    });
  }
});

//Slack bot http routing
receiver.router.post("/nofticate", (req, res) => {
  const { channel, text } = req.body;
  app.client.chat.postMessage({
    channel,
    text,
  });
  console.log(text);
  res.json(req.body);
});
