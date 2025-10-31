import { Component } from '@angular/core';
import { ApiService } from '../services/api-service';
import { File } from '../types';

@Component({
  selector: 'app-document-viewer',
  imports: [],
  templateUrl: './document-viewer.html',
  styleUrl: './document-viewer.css',
})
export class DocumentViewer {
  files: File[] = [];
  constructor(private apiService: ApiService) {
    this.loadFiles();
  }

  loadFiles() {
    this.apiService.getData().subscribe((data) => {
      this.files = data;
    });
  }
}
