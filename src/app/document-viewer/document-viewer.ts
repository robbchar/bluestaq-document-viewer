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
  allFilesSelected: boolean = false;
  pdfLoading: boolean = false;

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
    if (file !== this.selectedFile) {
      this.selectedFile = file;
      this.fileUrl = this.apiService.getFileUrlByLegalFileRecordId(
        file.legalFileRecordId,
      );
      this.pdfLoading = true;
    }
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
  }

  agreeToFileTypeChange(event: Event, fileType: string) {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      this.checkedFileTypes.push(fileType);
    } else {
      this.checkedFileTypes = this.checkedFileTypes.filter(
        (type) => type !== fileType,
      );
    }
    this.allFilesSelected =
      this.checkedFileTypes.length === this.fileTypes.length;
  }

  submitAgreement() {
    console.log(
      'agreed to files',
      this.files.map((file) => file.legalFileRecordId),
    );
  }

  callBackFn() {
    this.pdfLoading = false;
  }
}
