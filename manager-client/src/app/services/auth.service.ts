import { adresses } from './../data/adresses';
import { IOrder } from './../models/order';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface ISignin {
  access_token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  signIn(login: string, password: string): Observable<ISignin> {
    return this.http.post<ISignin>(adresses.managerServer + '/auth/signin', {
      login,
      password,
    });
  }
}
