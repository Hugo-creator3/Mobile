import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class TarjetaService {

  private API = 'https://backendv-4q6s.onrender.com/api/tarjeta';

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