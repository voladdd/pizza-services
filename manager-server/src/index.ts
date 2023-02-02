import { MongoClient } from "mongodb";
import * as dotenv from "dotenv";
dotenv.config();

//Mongo Setup
const client = new MongoClient(process.env.MONGO_URI);

async function run() {
  try {
    const database = client.db("slack_bot_db");
    const orders = database.collection("orders_collection");
    // const result = await orders.(order);
    console.log(`A document was inserted with the _id: ${orders}`);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

run().catch((e) => console.log(e));
