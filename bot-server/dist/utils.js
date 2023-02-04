"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
class Order {
    /**
       *
       * @param userMessage
       *
       * @example:
       *  `Название - Пепперони фреш
          Размер - 30 см
          Тесто - традиционное тесто
          Бортик - сырный
          Добавки - сочные ананасы
          Адрес доставки - Ул. Есенина, Дом Каруселина
          Комментарий к заказу - Жду, жду, жду`
       */
    constructor(userMessage, channelId, userName, userPhoto, teamId) {
        this.associations = new Map([
            ["Название", "Name"],
            ["Размер", "Size"],
            ["Тесто", "Dough"],
            ["Бортик", "Crust"],
            ["Добавки", "Species"],
            ["Адрес доставки", "Address"],
            ["Комментарий к заказу", "Comment"],
        ]);
        this.orderInfo = new Map();
        userMessage.split("\n").forEach((row) => {
            const [key, value] = row.split(/\s*-\s*/, 2);
            if (this.associations.has(key)) {
                this.orderInfo.set(this.associations.get(key), value);
            }
            else {
                console.log(key + " is not associated key");
            }
        });
        this.orderInfo.set("UserName", userName);
        this.orderInfo.set("ChannelId", channelId);
        this.orderInfo.set("UserPhoto", userPhoto);
        this.orderInfo.set("TeamId", teamId);
        this.orderInfo.set("OrderStatus", "Оформлен");
    }
    getOrderInfo() {
        return Object.fromEntries(this.orderInfo);
    }
}
exports.Order = Order;
//# sourceMappingURL=utils.js.map