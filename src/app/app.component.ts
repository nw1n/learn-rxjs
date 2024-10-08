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
    <div>non-async: {{ myValue | json }}</div>
    <div>async: {{ $incrementOverTime | async | json }}</div>`,
})
export class ExampleComponent {
  myValue = 0;
  $incrementOverTime!: Observable<number>;

  ngOnInit() {
    this.nonAsyncWay();
    this.asyncWay();
  }

  nonAsyncWay() {
    const $incrementOverTime = new Observable((observer: Observer<number>) => {
      let count = 0;
      const intervalId = setInterval(() => {
        observer.next(count++);
      }, 1000);

      return () => {
        clearInterval(intervalId);
      };
    });

    const observerNextFn = (value: number) => {
      this.myValue = value;
    };

    const mySub = $incrementOverTime.subscribe(observerNextFn);
  }

  asyncWay() {
    this.$incrementOverTime = new Observable((observer: Observer<number>) => {
      let count = 0;
      const intervalId = setInterval(() => {
        observer.next(count++);
      }, 1000);

      return () => {
        clearInterval(intervalId);
      };
    });
  }
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ExampleComponent],
  template: `<example-component></example-component>`,
})
export class AppComponent {}