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
  template: `
    <h1>Example</h1>
    <p>myTemplateVal {{ myTemplateVal }}</p>
    <p>myTemplateValAsync {{ $executeThrice | async }}</p>
    <p>myTemplateValSignal {{ executeThriceSignal() }}</p>
    <p>myTemplateValSignalTwice {{ executeTwiceSignal() }}</p>
    <p>myTemplateValSignalTwiceDouble {{ executeTwiceDoubleSignal() }}</p>
    <p>myTemplateValAnotherObservable {{ $anotherObservable | async }}</p>
  `,
})
export class ExampleComponent {
  myTemplateVal = 0;
  $executeThrice!: Observable<any>;
  executeThriceSignal!: Signal<any>;
  executeTwiceSignal!: Signal<any>;
  executeTwiceDoubleSignal!: Signal<any>;
  $anotherObservable!: Observable<any>;

  constructor() {
    console.log('this start of constructor');
    const $executeThrice = new Observable((observer: Observer<number>) => {
      observer.next(1);
      observer.next(2);
      observer.next(3);
      observer.complete();
    }).pipe(tap((value) => console.log(value)));
    // pipe tap console.log will be called before 'this end of constructor'
    // because of toSignal
    this.executeThriceSignal = toSignal($executeThrice);

    const $executeTwice = $executeThrice.pipe(take(2));
    this.executeTwiceSignal = toSignal($executeTwice);

    const $executeTwiceDouble = $executeTwice.pipe(map((value) => value * 2));
    this.executeTwiceDoubleSignal = toSignal($executeTwiceDouble);

    this.$anotherObservable = new Observable((observer: Observer<any>) => {
      observer.next('A');
      observer.next('B');
      observer.complete();
    }).pipe(tap((value) => console.log(value)));
    // this will be called after 'this end of constructor', when the template is rendered

    console.log('this end of constructor');
  }

  ngOnInit() {
    //this.baseWay();
    this.otherWay();
  }

  otherWay() {}

  baseWay() {
    const $executeThrice = new Observable((observer: Observer<number>) => {
      observer.next(1);
      observer.next(2);
      observer.next(3);
      observer.complete();
    });
    this.$executeThrice = $executeThrice;

    $executeThrice.subscribe({
      next: (value) => console.log(value),
      complete: () => console.log('Complete 1'),
    });

    $executeThrice.subscribe({
      next: (value) => {
        this.myTemplateVal = value;
        console.log(value);
      },
      complete: () => console.log('Complete 2'),
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