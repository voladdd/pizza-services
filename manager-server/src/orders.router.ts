import express from "express";
import DbInstance from "./db/conn";
import { ObjectId } from "mongodb";
// import got from "got";

const ordersRouter = express.Router();

ordersRouter.get("/", async (req, res) => {
  const client = DbInstance.getClient();
  try {
    const database = client.db("slack_bot_db");
    const result = await database
      .collection("orders_collection")
      .find({})
      .limit(50)
      .toArray();

    res.json(result);
  } catch (e) {
    console.log(e);
  }
});

interface updateStatusBody {
  OrderStatus: string;
}

ordersRouter.patch("/:id", async (req, res) => {
  const client = DbInstance.getClient();
  const body: updateStatusBody = req.body;
  const id = req.params.id;

  try {
    const database = client.db("slack_bot_db");
    const collection = database.collection("orders_collection");
    const finded = await collection.findOne({
      _id: new ObjectId(id),
    });
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: { OrderStatus: body.OrderStatus },
        $currentDate: { lastModified: true },
      }
    );

    try {
      const got = (await import("got")).got;

      await got
        .post("http://localhost:3000/nofticate", {
          json: {
            text: `Текущий статус заказа: ${body.OrderStatus}`,
            channel: finded.ChannelId,
          },
        })
        .json();
      console.log("Sended noftication to bot & got data.");
    } catch (error) {
      console.log(error);
    } finally {
      res.json(result);
    }
  } catch (e) {
    console.log(e);
    res.errored;
  }
});

export default ordersRouter;
