import { Component } from '@angular/core';
import { ApiService } from '../services/api-service';
import { File } from '../types';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-document-viewer',
  imports: [PdfViewerModule, CommonModule],
  templateUrl: './document-viewer.html',
  styleUrl: './document-viewer.css',
})
export class DocumentViewer {
  files: File[] = [];
  selectedFile: File | null = null;
  fileUrl: string = '';
  checkedFileIds: string[] = [];
  fileTypes: string[] = [];
  checkedFileTypes: string[] = [];
  constructor(private apiService: ApiService) {
    this.loadFiles();
  }

  loadFiles() {
    this.apiService.getData().subscribe((data) => {
      this.files = data;
      this.fileTypes = [...new Set(data.map((file) => file.type))];
    });
  }

  getFilesByType(fileType: string): File[] {
    return this.files.filter((file) => file.type === fileType);
  }

  selectFile(file: File) {
    this.selectedFile = file;
    this.fileUrl = this.apiService.getFileUrlByLegalFileRecordId(
      file.legalFileRecordId,
    );
  }

  public downloadFile(): void {
    if (this.selectedFile) {
      const filePath = this.apiService.downloadFileByLegalFileRecordId(
        this.selectedFile.legalFileRecordId,
      );
      const a = document.createElement('a');
      a.href = filePath;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }

  public selectFileType(fileType: string) {
    const completeFiles = this.files
      .filter((file) => file.type === fileType)
      .filter((file) => file.changesOnly === false);
    if (completeFiles.length > 0) {
      this.selectFile(completeFiles[0]);
    }
    // if (this.checkedFileTypes.includes(fileType)) {
    //   this.checkedFileTypes = this.checkedFileTypes.filter(
    //     (type) => type !== fileType,
    //   );
    // } else {
    //   this.checkedFileTypes.push(fileType);
    // }
  }
}
