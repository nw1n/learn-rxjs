import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  input,
  Signal,
  ViewChild,
} from '@angular/core';
import {
  BehaviorSubject,
  concat,
  concatAll,
  concatMap,
  from,
  fromEvent,
  interval,
  map,
  mapTo,
  mergeAll,
  Observable,
  Observer,
  of,
  Subject,
  switchAll,
  switchMap,
  take,
  tap,
  timer,
} from 'rxjs';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';

@Component({
  selector: 'child-component',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h1>Child</h1>
    <p>myInput: {{ myInput() }}</p>
    <p>my async observable: {{ myObservable | async }}</p>
  `,
})
export class TheChildComponent {
  myTemplateVal = 0;
  myInput = input<number>(0);
  myObservable = toObservable(this.myInput);

  constructor() {
    this.myObservable.subscribe((val) => {
      console.log('my observable emitted', val);
    });
  }
}

@Component({
  selector: 'example-component',
  standalone: true,
  imports: [CommonModule, TheChildComponent],
  template: `
    <h1>Example</h1>
    <p>Val: {{ myTemplateVal }}</p>
    <button (click)="emittEvent()">Emit Event</button>
    <child-component [myInput]="myTemplateVal"></child-component>
  `,
})
export class ExampleComponent {
  myTemplateVal = 0;
  myEventEmitter = new EventEmitter();
  myObservable: Observable<number>;

  constructor() {
    this.myObservable = from(this.myEventEmitter);
  }

  ngAfterViewInit() {
    console.log('ngAfterViewInit');

    this.myEventEmitter.subscribe((val) => {
      console.log('Event emitted', val);
      this.myTemplateVal = val;
    });

    this.myObservable.subscribe((val) => {
      console.log('Observable emitted', val);
      this.myTemplateVal = val;
    });

    const myDoubleLoggerObservable$ = this.myObservable.pipe(
      map((val) => val * 2)
    );

    myDoubleLoggerObservable$.subscribe((val) => {
      console.log('Double Observable emitted', val);
    });
  }

  emittEvent() {
    this.myEventEmitter.emit(this.myTemplateVal + 1);
  }
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ExampleComponent],
  template: `<example-component></example-component>`,
})
export class AppComponent {}