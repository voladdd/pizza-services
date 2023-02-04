import { OrdersService } from './../../services/orders.service';
import { statuses } from 'src/app/data/statuses';
import { IOrder } from './../../models/order';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
})
export class OrderComponent {
  constructor(private ordersService: OrdersService) {}

  @Input()
  order!: IOrder;

  @Input()
  _id!: string;

  @Input()
  selected!: boolean;

  statuses: string[] = statuses;

  onSelected(status: string) {
    this.ordersService.patchOrder(this.order._id, status).subscribe({
      next: (v) => {
        alert('Статус успешно изменен!');
      },
      error: (e) => {
        alert(e.error);
      },
    });
  }
}
