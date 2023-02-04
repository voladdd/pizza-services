"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuth = void 0;
const express_1 = __importDefault(require("express"));
const conn_1 = __importDefault(require("./db/conn"));
function isAuth(req, res, next) {
    const auth = req.headers.authorization;
    if (auth === "an_access_token") {
        next();
    }
    else {
        res.status(401);
        res.send("Нет доступа");
    }
}
exports.isAuth = isAuth;
const authRouter = express_1.default.Router();
authRouter.post("/signin", async (req, res) => {
    //getting password & login
    const login = req.body.login;
    const password = req.body.password;
    //checking them in db
    const client = conn_1.default.getClient();
    try {
        const database = client.db("slack_bot_db");
        const result = await database.collection("users").findOne({ login });
        if (result && result.password === password) {
            res.status(200);
            res.json({ access_token: "an_access_token" });
        }
        else {
            res.status(401);
            res.send("Неправильный логин/пароль");
        }
    }
    catch (e) {
        console.log(e);
    }
});
exports.default = authRouter;
//# sourceMappingURL=auth.router.js.map