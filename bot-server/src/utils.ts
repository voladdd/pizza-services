export class Order {
  private associations = new Map<string, string | null>([
    ["Название", "Name"],
    ["Размер", "Size"],
    ["Тесто", "Dough"],
    ["Бортик", "Crust"],
    ["Добавки", "Species"],
    ["Адрес доставки", "Address"],
    ["Комментарий к заказу", "Comment"],
  ]);

  private orderInfo = new Map();

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
  constructor(userMessage: string, channelId: string, userName: string) {
    userMessage.split("\n").forEach((row) => {
      const [key, value] = row.split(/\s*-\s*/, 2);
      if (this.associations.has(key)) {
        this.orderInfo.set(this.associations.get(key), value);
      } else {
        console.log(key + " is not associated key");
      }
    });
    this.orderInfo.set("UserName", userName);
    this.orderInfo.set("ChannelId", channelId);
  }

  getOrderInfo() {
    return [...this.orderInfo.entries()];
  }
}
