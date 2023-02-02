import express from "express";
import DbInstance from "./db/conn";
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
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
});

ordersRouter.patch("/:id", (req, res) => {
  res.send("Request Id: " + req.params.id);
});

export default ordersRouter;
