import { adresses } from './../data/adresses';
import { IOrder } from './../models/order';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<IOrder[]> {
    return this.http.get<IOrder[]>(adresses.managerServer + '/orders', {
      headers: { authorization: 'an_access_token' },
    });
  }

  patchOrder(id: string, orderStatus: string) {
    return this.http.patch(
      adresses.managerServer + '/orders/' + id,
      {
        OrderStatus: orderStatus,
      },
      { headers: { authorization: 'an_access_token' } }
    );
  }
}
