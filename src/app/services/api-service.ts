import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { File } from '../types';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  getData(): Observable<File[]> {
    const apiUrl = 'http://localhost:4200/api/data';
    return this.http.get<File[]>(apiUrl);
  }

  getFileById(id: string): Observable<File> {
    const apiUrl = `http://localhost:4200/api/data/${id}`;
    return this.http.get<File>(apiUrl);
  }

  getUserAgreement(fileIds: string[]): Observable<string> {
    const apiUrl = 'http://localhost:4200/api/data/user-agreement';
    return this.http.post<string>(apiUrl, { fileIds });
  }
}
