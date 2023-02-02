import express from "express";
import ordersRouter from "./orders.router";
import * as dotenv from "dotenv";
import DbInstance from "./db/conn";
dotenv.config();

//Express Setup
const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());
app.use("/orders", ordersRouter);
DbInstance.getClient();

app.listen(port, () => {
  console.log("server is running at port " + port);
});
