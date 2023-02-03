import { App, ExpressReceiver } from "@slack/bolt";
import { Order } from "./utils";
import { MongoClient } from "mongodb";
import * as dotenv from "dotenv";
import bodyParser = require("body-parser");
dotenv.config();

//Mongo Setup
const client = new MongoClient(process.env.MONGO_URI);

async function insertObjectToCollection(obj: object, collectionName: string) {
  try {
    const database = client.db("slack_bot_db");
    const collection = database.collection(collectionName);
    const result = await collection.insertOne(obj);
    console.log(
      `Object was inserted into ${collectionName} with the _id: ${result.insertedId}`
    );
  } catch (error) {
    // Ensures that the client will close when you finish/error
    console.log(error);
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
  // token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  appToken: process.env.APP_TOKEN,
  authorize: authorizeFn,
});

(async () => {
  const port = process.env.PORT || 3000;
  await app.start(port);
  // await run().catch(console.dir);

  console.log(`⚡️ Slack Bolt app is running on port ${port}!`);
})();

//Slack bot commands
app.command("/order-help", async ({ ack, say, context, body }) => {
  try {
    await ack();
    console.log(context);
    console.log("body ", body);
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
      userProfile.profile.image_512,
      command.team_id
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
    // await insertOrderToDb(slackOrder.getOrderInfo());
    await insertObjectToCollection(
      slackOrder.getOrderInfo(),
      "orders_collection"
    );
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
receiver.router.post("/nofticate", async (req, res) => {
  const { channel, text, teamId } = req.body;

  //Finding access token by teamid (repeating 2)
  const database = client.db("slack_bot_db");
  const collection = database.collection("installations");
  // Fetch team info from database
  const result = await collection
    .findOne({ "team.id": teamId })
    .catch((err) => console.log(err));

  if (!result) {
    console.log("Team was not founded in DB ");
    return;
  }

  await app.client.chat.postMessage({
    token: result.access_token,
    channel,
    text,
  });

  console.log(text);
  res.json(req.body);
});

receiver.router.get("/redirect", async (req, res) => {
  //parsing temporary authorization code
  const code = req.url.match(/\/redirect\?code=(.*)&state=/)[1];
  //getting access token
  const accessResponse = await app.client.oauth.v2.access({
    code,
    client_id: process.env.SLACK_CLIENT_ID,
    client_secret: process.env.SLACK_CLIENT_SECRET,
  });
  console.log(accessResponse);
  //saving response to db
  insertObjectToCollection(accessResponse, "installations");
  //redirect
  res.redirect("https://app.slack.com/client");
});

//Slack auth
async function authorizeFn({ teamId }: { teamId: string }) {
  const database = client.db("slack_bot_db");
  const collection = database.collection("installations");
  // Fetch team info from database
  const result = await collection
    .findOne({ "team.id": teamId })
    .catch((err) => console.log("Team was not founded in DB" + err));

  if (result) {
    return {
      botToken: result.access_token,
      botId: process.env.SLACK_BOT_ID,
      botUserId: result.bot_user_id,
    };
  }
  throw new Error("No matching authorizations");
}
