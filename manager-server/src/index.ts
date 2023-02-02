import express from "express";
import ordersRouter from "./orders.router";
import * as dotenv from "dotenv";
import DbInstance from "./db/conn";
dotenv.config();

DbInstance.getClient();

//Express Setup
const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());
app.use("/orders", ordersRouter);

app.listen(port, () => {
  console.log("server is running at port " + port);
});
