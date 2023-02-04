import { AuthService } from './services/auth.service';
import { OrdersService } from './services/orders.service';
import { IOrder } from './models/order';
import { FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
// import { orders as data } from './data/orders';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'client';

  authed = this.isAuthed();
  token: string | null = null;

  orders: IOrder[] = [];

  checkoutForm = this.formBuilder.group({
    login: '',
    password: '',
  });

  isAuthed(): boolean {
    return localStorage.getItem('access_token') !== null;
  }

  signOut(): void {
    this.authed = false;
  }

  signIn(login: string, password: string) {
    this.authService.signIn(login, password).subscribe({
      next: (v) => {
        this.token = v.access_token;
        this.authed = true;
      },
      error: (e) => alert(e.error),
      complete: () => console.info('complete'),
    });
  }

  constructor(
    private ordersService: OrdersService,
    private authService: AuthService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.ordersService.getAll().subscribe((orders) => {
      this.orders = orders;
      console.log(orders);
    });
  }

  onSubmit(): void {
    // Process checkout data here
    let formValues = this.checkoutForm.value;
    if (formValues.login && formValues.password) {
      this.signIn(formValues.login, formValues.password);
      // console.warn('Your order has been submitted', this.checkoutForm.value);
    }
    this.checkoutForm.reset();
  }
}
