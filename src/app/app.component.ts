import { CommonModule } from '@angular/common';
import { Component, Signal, ViewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  BehaviorSubject,
  concat,
  fromEvent,
  interval,
  map,
  mapTo,
  Observable,
  of,
  take,
  tap,
  timer,
} from 'rxjs';

@Component({
  selector: 'app-try-one',
  standalone: true,
  imports: [CommonModule],
  template: ` <h1>Try Two Component</h1> `,
})
export class TryOneComponent {
  ngOnInit() {
    this.regularWay();
    this.rxjsWay();
  }

  private regularWay() {}

  private rxjsWay() {}
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TryOneComponent],
  template: `<app-try-one />`,
})
export class AppComponent {}