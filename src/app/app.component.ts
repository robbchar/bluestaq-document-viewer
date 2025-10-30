import { Component, OnInit } from '@angular/core';
import { ApiService } from './services/api-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  title = 'my-angular-app';
  data: unknown;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.apiService.getData().subscribe((response) => {
      this.data = (response as { message: unknown }).message;
    });
  }
}
