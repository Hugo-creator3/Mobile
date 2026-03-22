import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private API = 'http://localhost:3000/api/usuarios';

  constructor(private http: HttpClient) {}

  register(data: any): Observable<any> {
    return this.http.post(`${this.API}/register`, data);
  }

  login(data: any): Observable<any> {
    return this.http.post(`${this.API}/login`, data);
  }
 getProfile(): Observable<any> {
  const token = localStorage.getItem('token');

  return this.http.get(`${this.API}/me`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}
uploadPhoto(data: FormData): Observable<any> {
  const token = localStorage.getItem('token');

  return this.http.post(`${this.API}/upload-photo`, data, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

getMiTarjeta() {
  return this.http.get<any>('http://localhost:3000/api/usuarios/mi-tarjeta');
}
}