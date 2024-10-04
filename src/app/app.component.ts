import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TryOneComponent } from './try-one/try-one.component';
import { TryTwoComponent } from './try-one/try-two.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, TryTwoComponent],
  template: `
    <h1>{{ title }}</h1>
    <app-try-two></app-try-two>
  `,
})
export class AppComponent {
  title = 'learn-rxjs';

  constructor() {
    console.log('AppComponent constructor');
  }
}
