import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class TarjetaService {

  private API = 'http://localhost:3000/api/tarjeta';

  constructor(private http: HttpClient) {}

  getTarjeta() {
    const token = localStorage.getItem('token');

    return this.http.get<any>(this.API, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }
}