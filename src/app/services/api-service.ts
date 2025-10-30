import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  getData(): Observable<unknown> {
    const apiUrl = 'http://localhost:4200/api/data';
    return this.http.get<unknown>(apiUrl);
  }
}
