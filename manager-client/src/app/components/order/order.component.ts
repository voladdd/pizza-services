import { statuses } from 'src/app/data/statuses';
import { IOrder } from './../../models/order';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
})
export class OrderComponent {
  @Input()
  order!: IOrder;

  @Input()
  _id!: string;

  @Input()
  selected!: boolean;

  statuses: string[] = statuses;

  onSelected(status: string) {}
}
