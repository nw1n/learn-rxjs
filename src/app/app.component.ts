import { CommonModule } from '@angular/common';
import { Component, Signal, ViewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';
import {
  BehaviorSubject,
  concat,
  concatAll,
  concatMap,
  fromEvent,
  interval,
  map,
  mapTo,
  mergeAll,
  Observable,
  Observer,
  of,
  switchAll,
  switchMap,
  take,
  tap,
  timer,
} from 'rxjs';
import { SafeSubscriber, Subscriber } from 'rxjs/internal/Subscriber';

@Component({
  selector: 'example-component',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <router-outlet></router-outlet>
    <h1>Example</h1>
    <p>myTemplateVal {{ myTemplateVal }}</p>
  `,
})
export class ExampleComponent {
  myTemplateVal = 0;

  constructor() {
    const $executeThrice = new Observable<number>(
      (observer: Observer<number>) => {
        observer.next(1);
        observer.next(2);
        observer.next(3);
        observer.complete();
      }
    );

    const $emitABC = new Observable<string>((observer: Observer<string>) => {
      observer.next('A');
      observer.next('B');
      observer.next('C');
      observer.complete();
    });

    const $emitNested = $executeThrice.pipe(
      map((val) => {
        return $emitABC;
      })
    );

    // $emitNested.subscribe({
    //   next: (val) => {
    //     console.log('val', val);
    //   },
    // });

    const $emitFlattened = $executeThrice.pipe(
      map((val) => {
        return $emitABC;
      }),
      concatAll() // this log A, B, C three times
    );

    const $emitFlattened2 = $executeThrice.pipe(
      map((val) => {
        return $emitABC;
      }),
      mergeAll() // this log A, B, C three times
    );

    const $concatMapped = $executeThrice.pipe(
      // concatMap is a shorthand: it is the same as map + concatAll
      concatMap((val) => {
        return $emitABC;
      })
    );

    $concatMapped.subscribe({
      next: (val) => {
        console.log('val', val);
      },
    });

    // $executeThrice.subscribe({
    //   next: (val) => {
    //     console.log('val', val);
    //   },
    // });
  }
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ExampleComponent],
  template: `<example-component></example-component>`,
})
export class AppComponent {}