import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AsistenciasService {

  private API = 'https://backendv-4q6s.onrender.com/api/asistencias';

  constructor(private http: HttpClient) {}

  getMyAsistencias() {
    const token = localStorage.getItem('token');

    return this.http.get<any[]>(`${this.API}/me`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }
}