import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DocumentViewer } from './document-viewer';
import { ApiService } from '../services/api-service';
import { File } from '../types';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';

describe('DocumentViewer', () => {
  let component: DocumentViewer;
  let fixture: ComponentFixture<DocumentViewer>;
  let apiService: jasmine.SpyObj<ApiService>;

  const mockFiles: File[] = [
    {
      legalFileRecordId: 'id-1',
      type: 'VENDOR AGREEMENT',
      fileName: 'agreement1.pdf',
      version: 2,
      changesOnly: false,
    },
    {
      legalFileRecordId: 'id-2',
      type: 'VENDOR AGREEMENT',
      fileName: 'agreement1-changes.pdf',
      version: 2,
      changesOnly: true,
    },
    {
      legalFileRecordId: 'id-3',
      type: 'TERMS OF SERVICE',
      fileName: 'terms.pdf',
      version: 1,
      changesOnly: false,
    },
  ];

  beforeEach(async () => {
    const apiServiceSpy = jasmine.createSpyObj('ApiService', [
      'getData',
      'getFileUrlByLegalFileRecordId',
      'getDownloadFileUrlByLegalFileRecordId',
      'getUserAgreement',
    ]);

    apiServiceSpy.getData.and.returnValue(of(mockFiles));
    apiServiceSpy.getFileUrlByLegalFileRecordId.and.returnValue('/api/file/id');
    apiServiceSpy.getDownloadFileUrlByLegalFileRecordId.and.returnValue(
      '/api/download/id',
    );

    await TestBed.configureTestingModule({
      imports: [DocumentViewer],
      providers: [{ provide: ApiService, useValue: apiServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(DocumentViewer);
    component = fixture.componentInstance;
    apiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should load files on initialization', (done) => {
      fixture.detectChanges();

      component.files$.subscribe((files) => {
        expect(files).toEqual(mockFiles);
        expect(apiService.getData).toHaveBeenCalled();
        done();
      });
    });

    it('should set loading state to loading initially', () => {
      expect(component.loadingState()).toBe('loading');
    });

    it('should set loading state to success after files load', (done) => {
      fixture.detectChanges();

      component.files$.subscribe(() => {
        expect(component.loadingState()).toBe('success');
        done();
      });
    });

    it('should group files by type after loading', (done) => {
      fixture.detectChanges();

      component.files$.subscribe(() => {
        expect(component.groupedFilesByType['VENDOR AGREEMENT'].length).toBe(2);
        expect(component.groupedFilesByType['TERMS OF SERVICE'].length).toBe(1);
        done();
      });
    });

    it('should extract unique file types', (done) => {
      fixture.detectChanges();

      component.files$.subscribe(() => {
        expect(component.fileTypes).toContain('VENDOR AGREEMENT');
        expect(component.fileTypes).toContain('TERMS OF SERVICE');
        expect(component.fileTypes.length).toBe(2);
        done();
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle API errors gracefully', (done) => {
      const error = new Error('API Error');
      const errorApiService = jasmine.createSpyObj('ApiService', [
        'getData',
        'getFileUrlByLegalFileRecordId',
        'getDownloadFileUrlByLegalFileRecordId',
        'getUserAgreement',
      ]);
      errorApiService.getData.and.returnValue(throwError(() => error));
      errorApiService.getFileUrlByLegalFileRecordId.and.returnValue(
        '/api/file/id',
      );
      errorApiService.getDownloadFileUrlByLegalFileRecordId.and.returnValue(
        '/api/download/id',
      );

      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        imports: [DocumentViewer],
        providers: [{ provide: ApiService, useValue: errorApiService }],
      }).compileComponents();

      const errorFixture = TestBed.createComponent(DocumentViewer);
      const errorComponent = errorFixture.componentInstance;
      errorFixture.detectChanges();

      errorComponent.files$.subscribe((files) => {
        expect(files).toEqual([]);
        expect(errorComponent.loadingState()).toBe('error');
        expect(errorComponent.errorMessage).toContain(
          'Failed to load documents',
        );
        done();
      });
    });

    it('should set error message when API fails', (done) => {
      const errorApiService = jasmine.createSpyObj('ApiService', [
        'getData',
        'getFileUrlByLegalFileRecordId',
        'getDownloadFileUrlByLegalFileRecordId',
        'getUserAgreement',
      ]);
      errorApiService.getData.and.returnValue(
        throwError(() => new Error('Network error')),
      );
      errorApiService.getFileUrlByLegalFileRecordId.and.returnValue(
        '/api/file/id',
      );
      errorApiService.getDownloadFileUrlByLegalFileRecordId.and.returnValue(
        '/api/download/id',
      );

      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        imports: [DocumentViewer],
        providers: [{ provide: ApiService, useValue: errorApiService }],
      }).compileComponents();

      const errorFixture = TestBed.createComponent(DocumentViewer);
      const errorComponent = errorFixture.componentInstance;
      errorFixture.detectChanges();

      errorComponent.files$.subscribe(() => {
        expect(errorComponent.errorMessage).toBeTruthy();
        expect(errorComponent.errorMessage.length).toBeGreaterThan(0);
        done();
      });
    });
  });

  describe('File Selection', () => {
    beforeEach(() => {
      fixture.detectChanges();
      component.files$.subscribe();
    });

    it('should select a file when selectFile is called', () => {
      const file = mockFiles[0];

      component.selectFile(file);

      expect(component.selectedFile).toBe(file);
      expect(component.fileUrl).toBe('/api/file/id');
      expect(apiService.getFileUrlByLegalFileRecordId).toHaveBeenCalledWith(
        'id-1',
      );
    });

    it('should set pdfLoading to true when selecting a file', () => {
      const file = mockFiles[0];

      component.selectFile(file);

      expect(component.pdfLoading).toBe(true);
    });

    it('should not update if same file is selected again', () => {
      const file = mockFiles[0];
      component.selectFile(file);
      const initialCallCount =
        apiService.getFileUrlByLegalFileRecordId.calls.count();

      component.selectFile(file);

      expect(apiService.getFileUrlByLegalFileRecordId.calls.count()).toBe(
        initialCallCount,
      );
    });

    it('should select complete file when selectFileType is called', () => {
      component.selectFileType('VENDOR AGREEMENT');

      expect(component.selectedFile).toBeTruthy();
      if (component.selectedFile) {
        expect(component.selectedFile.changesOnly).toBe(false);
        expect(component.selectedFile.type).toBe('VENDOR AGREEMENT');
      }
    });
  });

  describe('Auto-Select Default File', () => {
    beforeEach(() => {
      fixture.detectChanges();
      component.files$.subscribe();
    });

    it('should auto-select a file after loading', () => {
      expect(component.selectedFile).toBeTruthy();
    });

    it('should select complete file when available', () => {
      component.selectedFile = null;
      component.autoSelectDefaultFile();

      expect(component.selectedFile).toBeTruthy();
      expect((component.selectedFile as File | null)?.changesOnly).toBe(false);
    });
  });

  describe('Checkbox Agreement', () => {
    beforeEach(() => {
      fixture.detectChanges();
      component.files$.subscribe();
    });

    it('should add file type when checkbox is checked', () => {
      const event = {
        target: { checked: true },
      } as unknown as Event;

      component.agreeToFileTypeChange(event, 'VENDOR AGREEMENT');

      expect(component.checkedFileTypes).toContain('VENDOR AGREEMENT');
    });

    it('should remove file type when checkbox is unchecked', () => {
      component.checkedFileTypes = ['VENDOR AGREEMENT'];
      const event = {
        target: { checked: false },
      } as unknown as Event;

      component.agreeToFileTypeChange(event, 'VENDOR AGREEMENT');

      expect(component.checkedFileTypes).not.toContain('VENDOR AGREEMENT');
    });

    it('should set allFilesSelected to true when all types are checked', () => {
      component.fileTypes = ['VENDOR AGREEMENT', 'TERMS OF SERVICE'];

      component.agreeToFileTypeChange(
        { target: { checked: true } } as unknown as Event,
        'VENDOR AGREEMENT',
      );
      component.agreeToFileTypeChange(
        { target: { checked: true } } as unknown as Event,
        'TERMS OF SERVICE',
      );

      expect(component.allFilesSelected).toBe(true);
    });

    it('should set allFilesSelected to false when not all types are checked', () => {
      component.fileTypes = ['VENDOR AGREEMENT', 'TERMS OF SERVICE'];
      component.checkedFileTypes = ['VENDOR AGREEMENT'];

      expect(component.allFilesSelected).toBe(false);
    });
  });

  describe('Form Submission', () => {
    beforeEach(() => {
      fixture.detectChanges();
      component.files$.subscribe();
      spyOn(console, 'log');
    });

    it('should log agreed file IDs when submitted', () => {
      component.files = mockFiles;

      component.submitAgreement();

      expect(console.log).toHaveBeenCalledWith(
        'agreed to files',
        jasmine.arrayContaining(['id-1', 'id-2', 'id-3']),
      );
    });

    it('should log all file IDs from files array', () => {
      component.files = [mockFiles[0], mockFiles[2]];

      component.submitAgreement();

      expect(console.log).toHaveBeenCalledWith('agreed to files', [
        'id-1',
        'id-3',
      ]);
    });
  });

  describe('File Download', () => {
    let createElementSpy: jasmine.Spy;
    let componentDocument: Document;

    beforeEach(() => {
      fixture.detectChanges();
      component.files$.subscribe();
      component.selectedFile = mockFiles[0];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      componentDocument = (component as any).document as Document;
    });

    it('should create download link when downloadFile is called', () => {
      const mockLink = document.createElement('a');
      createElementSpy = spyOn(
        componentDocument,
        'createElement',
      ).and.returnValue(mockLink);

      component.downloadFile();

      expect(createElementSpy).toHaveBeenCalledWith('a');
    });

    it('should set link href and download attributes', () => {
      const mockLink = document.createElement('a');
      createElementSpy = spyOn(
        componentDocument,
        'createElement',
      ).and.returnValue(mockLink);

      component.downloadFile();

      expect(mockLink.href).toContain('/api/download/id');
      expect(mockLink.download).toBe('agreement1.pdf');
    });

    it('should click the link and clean up', () => {
      const mockLink = document.createElement('a');
      const clickSpy = spyOn(mockLink, 'click');
      const appendChildSpy = spyOn(componentDocument.body, 'appendChild');
      const removeChildSpy = spyOn(componentDocument.body, 'removeChild');
      createElementSpy = spyOn(
        componentDocument,
        'createElement',
      ).and.returnValue(mockLink);

      component.downloadFile();

      expect(clickSpy).toHaveBeenCalled();
      expect(appendChildSpy).toHaveBeenCalledWith(mockLink);
      expect(removeChildSpy).toHaveBeenCalledWith(mockLink);
    });

    it('should not download if no file is selected', () => {
      component.selectedFile = null;
      createElementSpy = spyOn(componentDocument, 'createElement');

      component.downloadFile();

      expect(createElementSpy).not.toHaveBeenCalled();
    });
  });

  describe('PDF Loading State', () => {
    it('should set pdfLoading using setPDFLoading', () => {
      component.setPDFLoading(true);
      expect(component.pdfLoading).toBe(true);

      component.setPDFLoading(false);
      expect(component.pdfLoading).toBe(false);
    });
  });

  describe('PDF Error Handling', () => {
    beforeEach(() => {
      spyOn(console, 'error');
    });

    it('should handle PDF loading errors', () => {
      const error = new Error('PDF failed to load');

      component.onPDFError(error);

      expect(console.error).toHaveBeenCalledWith('PDF error:', error);
      expect(component.errorMessage).toContain('Failed to load PDF');
      expect(component.pdfLoading).toBe(false);
      expect(component.loadingState()).toBe('error');
    });
  });

  describe('Template Rendering', () => {
    beforeEach(() => {
      fixture.detectChanges();
      component.files$.subscribe();
    });

    it('should display file types in the template', () => {
      fixture.detectChanges();

      const fileTypeElements = fixture.debugElement.queryAll(
        By.css('.preview-box-files-of-type'),
      );
      expect(fileTypeElements.length).toBeGreaterThan(0);
    });

    it('should disable submit button when not all files are checked', () => {
      component.allFilesSelected = false;
      fixture.detectChanges();

      const submitButton = fixture.debugElement.query(
        By.css('button[disabled]'),
      );
      expect(submitButton).toBeTruthy();
    });

    it('should enable submit button when all files are checked', () => {
      component.allFilesSelected = true;
      fixture.detectChanges();

      const submitButton = fixture.debugElement.query(
        By.css('button:not([disabled])'),
      );
      expect(submitButton).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty file array', (done) => {
      // Create a new component with empty array mock
      const emptyApiService = jasmine.createSpyObj('ApiService', [
        'getData',
        'getFileUrlByLegalFileRecordId',
        'getDownloadFileUrlByLegalFileRecordId',
        'getUserAgreement',
      ]);
      emptyApiService.getData.and.returnValue(of([]));
      emptyApiService.getFileUrlByLegalFileRecordId.and.returnValue(
        '/api/file/id',
      );
      emptyApiService.getDownloadFileUrlByLegalFileRecordId.and.returnValue(
        '/api/download/id',
      );

      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        imports: [DocumentViewer],
        providers: [{ provide: ApiService, useValue: emptyApiService }],
      }).compileComponents();

      const emptyFixture = TestBed.createComponent(DocumentViewer);
      const emptyComponent = emptyFixture.componentInstance;
      emptyFixture.detectChanges();

      emptyComponent.files$.subscribe((files) => {
        expect(files).toEqual([]);
        expect(emptyComponent.fileTypes).toEqual([]);
        expect(emptyComponent.groupedFilesByType).toEqual({});
        done();
      });
    });

    it('should handle files with no complete version', (done) => {
      const allChangesOnly: File[] = [
        {
          legalFileRecordId: 'id-1',
          type: 'VENDOR AGREEMENT',
          fileName: 'changes.pdf',
          version: 2,
          changesOnly: true,
        },
      ];

      // Create a new component with changes-only files mock
      const changesApiService = jasmine.createSpyObj('ApiService', [
        'getData',
        'getFileUrlByLegalFileRecordId',
        'getDownloadFileUrlByLegalFileRecordId',
        'getUserAgreement',
      ]);
      changesApiService.getData.and.returnValue(of(allChangesOnly));
      changesApiService.getFileUrlByLegalFileRecordId.and.returnValue(
        '/api/file/id',
      );
      changesApiService.getDownloadFileUrlByLegalFileRecordId.and.returnValue(
        '/api/download/id',
      );

      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        imports: [DocumentViewer],
        providers: [{ provide: ApiService, useValue: changesApiService }],
      }).compileComponents();

      const changesFixture = TestBed.createComponent(DocumentViewer);
      const changesComponent = changesFixture.componentInstance;
      changesFixture.detectChanges();

      changesComponent.files$.subscribe(() => {
        expect(
          changesComponent.groupedFilesByType['VENDOR AGREEMENT'].length,
        ).toBe(1);
        done();
      });
    });
  });
});
