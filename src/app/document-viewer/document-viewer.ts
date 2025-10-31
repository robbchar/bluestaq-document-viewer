import { Component } from '@angular/core';
import { ApiService } from '../services/api-service';
import { File } from '../types';
import { PdfViewerModule } from 'ng2-pdf-viewer';

@Component({
  selector: 'app-document-viewer',
  imports: [PdfViewerModule],
  templateUrl: './document-viewer.html',
  styleUrl: './document-viewer.css',
})
export class DocumentViewer {
  files: File[] = [];
  selectedFile: File | null = null;
  fileUrl: string = '';
  constructor(private apiService: ApiService) {
    this.loadFiles();
  }

  loadFiles() {
    this.apiService.getData().subscribe((data) => {
      this.files = data;
    });
  }

  selectFile(file: File) {
    this.selectedFile = file;
    this.fileUrl = this.apiService.getFilePathByLegalFileRecordId(
      file.legalFileRecordId,
    );
    console.log(this.fileUrl);
  }
}
