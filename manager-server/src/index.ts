import express from "express";
import cors from "cors";
import ordersRouter from "./orders.router";
import * as dotenv from "dotenv";
import DbInstance from "./db/conn";
import authRouter from "./auth.router";
dotenv.config();

DbInstance.getClient();

//Express Setup
const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(cors());
app.use("/orders", ordersRouter);
app.use("/auth", authRouter);

app.listen(port, () => {
  console.log("server is running at port " + port);
});
