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
  template: ` <h1>Child</h1> `,
})
export class TheChildComponent {}

@Component({
  selector: 'example-component',
  standalone: true,
  imports: [CommonModule, TheChildComponent],
  template: `
    <h1>Example</h1>
    <child-component></child-component>
  `,
})
export class ExampleComponent {}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ExampleComponent],
  template: `<example-component></example-component>`,
})
export class AppComponent {}