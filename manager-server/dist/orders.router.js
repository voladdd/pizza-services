"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const conn_1 = __importDefault(require("./db/conn"));
const mongodb_1 = require("mongodb");
const auth_router_1 = require("./auth.router");
const ordersRouter = express_1.default.Router();
ordersRouter.get("/", auth_router_1.isAuth, async (req, res) => {
    const client = conn_1.default.getClient();
    try {
        const database = client.db("slack_bot_db");
        const result = await database
            .collection("orders_collection")
            .find({})
            .sort({ lastModified: 1 })
            .toArray();
        res.json(result);
    }
    catch (e) {
        console.log(e);
    }
});
ordersRouter.patch("/:id", auth_router_1.isAuth, async (req, res) => {
    const client = conn_1.default.getClient();
    const body = req.body;
    const id = req.params.id;
    try {
        const database = client.db("slack_bot_db");
        const collection = database.collection("orders_collection");
        const finded = await collection.findOne({
            _id: new mongodb_1.ObjectId(id),
        });
        const result = await collection.updateOne({ _id: new mongodb_1.ObjectId(id) }, {
            $set: { OrderStatus: body.OrderStatus },
            $currentDate: { lastModified: true },
        });
        try {
            const got = (await import("got")).got;
            await got
                .post(`${process.env.NOFTICATION_URL}/nofticate`, {
                json: {
                    text: `Текущий статус заказа: ${body.OrderStatus}`,
                    channel: finded.ChannelId,
                    teamId: finded.TeamId,
                },
            })
                .json();
            console.log("Sended noftication to bot");
        }
        catch (error) {
            console.log(error);
        }
        finally {
            res.json(result);
        }
    }
    catch (e) {
        console.log(e);
        res.errored;
    }
});
exports.default = ordersRouter;
//# sourceMappingURL=orders.router.js.map