import { IOrder } from './../models/order';

export const orders: IOrder[] = [
  {
    _id: '63db3c82a2e552c22d03166c',
    Name: 'Пепперони фреш',
    Size: '30 см',
    Dough: 'традиционное тесто',
    Crust: 'сырный',
    Species: 'сочные ананасы',
    Address: 'Ул. Есенина, Дом Каруселина',
    Comment: 'Жду, жду, жду',
    UserName: 'svv.19',
    ChannelId: 'D04M4PWUHT7',
    UserPhoto:
      'https://avatars.slack-edge.com/2023-02-02/4736821939570_16dc61ac7fb9b44b8cca_512.jpg',
    OrderStatus: 'В доставке',
    lastModified: '2023-02-03T17:42:39.803Z',
    TeamId: 'T04M13M41CN',
  },
  {
    _id: '63dd45cb439db27f78e91bea',
    Name: 'Пепперони кэш',
    Size: '3000 см',
    Dough: 'традиционное тесто',
    Crust: 'сырный',
    Species: 'сочные ананасы',
    Address: 'Ул. Есенина, Дом Каруселина',
    Comment: 'Привет я второй заказ, хочу кушать',
    UserName: 'svv.19',
    ChannelId: 'D04N1N42NLC',
    UserPhoto:
      'https://secure.gravatar.com/avatar/7359da59c256fc35d5ff0633648f34eb.jpg?s=512&d=https%3A%2F%2Fa.slack-edge.com%2Fdf10d%2Fimg%2Favatars%2Fava_0024-512.png',
    TeamId: 'T04MZ75CLUS',
    OrderStatus: 'В пути',
    lastModified: '2023-02-03T17:41:45.531Z',
  },
];
