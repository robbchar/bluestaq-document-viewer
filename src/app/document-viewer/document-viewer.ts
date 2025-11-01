import { Component, DOCUMENT, inject, signal } from '@angular/core';
import { ApiService } from '../services/api-service';
import { File } from '../types';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { CommonModule } from '@angular/common';
import { Observable, tap, shareReplay, catchError, of } from 'rxjs';

@Component({
  selector: 'app-document-viewer',
  imports: [PdfViewerModule, CommonModule],
  templateUrl: './document-viewer.html',
  styleUrl: './document-viewer.css',
})
export class DocumentViewer {
  files$!: Observable<File[]>;
  files: File[] = [];
  selectedFile: File | null = null;
  fileUrl: string = '';
  fileTypes: string[] = [];
  checkedFileTypes: string[] = [];
  allFilesSelected: boolean = false;
  pdfLoading: boolean = false;
  errorMessage: string = '';
  groupedFilesByType: Record<string, File[]> = {};
  loadingState = signal<'idle' | 'loading' | 'error' | 'success'>('idle');
  private readonly document = inject(DOCUMENT);

  constructor(private apiService: ApiService) {
    this.loadingState.set('loading');
    this.files$ = this.apiService.getData().pipe(
      tap((data) => {
        this.loadingState.set('success');
        this.fileTypes = [...new Set(data.map((file) => file.type))];
        this.files = data;
        this.groupedFilesByType = this.fileTypes.reduce(
          (acc, type) => {
            acc[type] = this.files.filter((f) => f.type === type);
            return acc;
          },
          {} as Record<string, File[]>,
        );

        this.autoSelectDefaultFile();
      }),
      shareReplay(1),
      catchError((error) => {
        this.loadingState.set('error');
        console.error('Failed to load files:', error);
        this.errorMessage =
          'Failed to load documents. Please reload the page in a moment.';
        return of([]);
      }),
    );
  }

  autoSelectDefaultFile() {
    if (this.fileTypes.length > 0) {
      const firstType = this.fileTypes[0];
      const completeFile = this.groupedFilesByType[firstType].find(
        (f) => !f.changesOnly,
      );
      if (completeFile) {
        this.selectFile(completeFile);
      }
    }
  }

  selectFile(file: File) {
    if (file !== this.selectedFile) {
      this.selectedFile = file;
      this.fileUrl = this.apiService.getFileUrlByLegalFileRecordId(
        file.legalFileRecordId,
      );
      this.setPDFLoading(true);
    }
  }

  public downloadFile(): void {
    if (this.selectedFile) {
      const filePath = this.apiService.downloadFileByLegalFileRecordId(
        this.selectedFile.legalFileRecordId,
      );
      const link = this.document.createElement('a');
      link.href = filePath;
      link.download = this.selectedFile.fileName;
      this.document.body.appendChild(link);
      link.click();
      this.document.body.removeChild(link);
    }
  }

  public selectFileType(fileType: string) {
    const filesByType = this.files.filter((file) => file.type === fileType);
    if (filesByType.length > 0) {
      const completeFiles = filesByType.filter(
        (file) => file.changesOnly === false,
      );
      if (completeFiles.length > 0) {
        this.selectFile(completeFiles[0]);
      }
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

  onPDFError($event: unknown) {
    console.error('PDF error:', $event);
    this.errorMessage = 'Failed to load PDF file. Please try again.';
    this.setPDFLoading(false);
    this.loadingState.set('error');
  }

  setPDFLoading(loading: boolean) {
    this.pdfLoading = loading;
  }
}
