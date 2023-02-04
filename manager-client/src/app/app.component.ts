import { IOrder } from './models/order';
import { Component } from '@angular/core';
import { orders as data } from './data/orders';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'client';

  orders: IOrder[] = data;
}
