import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TryOneComponent } from './try-one/try-one.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, TryOneComponent],
  template: `
    <h1>{{ title }}</h1>
    <app-try-one></app-try-one>
  `,
})
export class AppComponent {
  title = 'learn-rxjs';

  constructor() {
    console.log('AppComponent constructor');
  }
}
