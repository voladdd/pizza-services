import express, { Response, Request, NextFunction } from "express";
import DbInstance from "./db/conn";

export function isAuth(req: Request, res: Response, next: any) {
  const auth = req.headers.authorization;
  if (auth === "an_access_token") {
    next();
  } else {
    res.status(401);
    res.send("Нет доступа");
  }
}

const authRouter = express.Router();

authRouter.post("/signin", async (req, res) => {
  //getting password & login
  const login = req.body.login;
  const password = req.body.password;
  //checking them in db
  const client = DbInstance.getClient();
  try {
    const database = client.db("slack_bot_db");
    const result = await database.collection("users").findOne({ login });

    if (result && result.password === password) {
      res.status(200);
      res.json({ access_token: "an_access_token" });
    } else {
      res.status(401);
      res.send("Неправильный логин/пароль");
    }
  } catch (e) {
    console.log(e);
  }
});

export default authRouter;
