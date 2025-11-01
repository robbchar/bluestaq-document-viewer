import { Component, signal } from '@angular/core';
import { DocumentViewer } from './document-viewer/document-viewer';

@Component({
  selector: 'app-root',
  imports: [DocumentViewer],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('frontend');
}
