import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { File } from '../types';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}
  host = 'http://localhost:4000';

  getData(): Observable<File[]> {
    const apiUrl = `${this.host}/api/data`;
    return this.http.get<File[]>(apiUrl);
  }

  getFileById(id: string): Observable<File> {
    const apiUrl = `${this.host}/api/data/${id}`;
    return this.http.get<File>(apiUrl);
  }

  getUserAgreement(fileIds: string[]): Observable<string> {
    const apiUrl = `${this.host}/api/data/user-agreement`;
    return this.http.post<string>(apiUrl, { fileIds });
  }

  getFileUrlByLegalFileRecordId(legalFileRecordId: string): string {
    return `${this.host}/api/data/file/path/${legalFileRecordId}`;
  }

  getDownloadFileUrlByLegalFileRecordId(legalFileRecordId: string): string {
    return `${this.host}/api/data/file/download/${legalFileRecordId}`;
  }
}
