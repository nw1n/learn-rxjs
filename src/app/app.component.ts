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
  Observer,
  of,
  take,
  tap,
  timer,
} from 'rxjs';
import { SafeSubscriber, Subscriber } from 'rxjs/internal/Subscriber';

@Component({
  selector: 'example-component',
  standalone: true,
  imports: [CommonModule],
  template: ` <h1>Example</h1>
    <div>value: {{ myValue }}</div>`,
})
export class ExampleComponent {
  myValue = 0;

  ngOnInit() {
    this.regularWay();
    this.rxJSWay();
  }

  regularWay() {}

  rxJSWay() {}
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ExampleComponent],
  template: `<example-component></example-component>`,
})
export class AppComponent {}