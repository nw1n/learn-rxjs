import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  EventEmitter,
  input,
  model,
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
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'child-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h1>Child</h1>
    <input type="text" [(ngModel)]="title" />
    <p>{{ titleUpperCase() }}</p>
    <input
      type="text"
      [ngModel]="countAsText | async"
      (ngModelChange)="handleTextChange($event)"
    />
    <p>countAsText: {{ countAsText | async }}</p>
    <p>countAsNumber: {{ countAsNumber | async }}</p>
    <button (click)="incrementNumber()">increment</button>
  `,
})
export class TheChildComponent {
  title = model('default-title');
  titleUpperCase = computed(() => this.title().toUpperCase());
  countAsText = new BehaviorSubject<string>('zero');
  countAsNumber = new BehaviorSubject<number>(0);

  numberChange = new EventEmitter<number>();

  constructor() {
    this.countAsText.pipe(map(nrStrToNr)).subscribe((val: any) => {
      this.setNumber(val);
    });
  }

  setNumber(value: number) {
    this.countAsNumber.next(value);
  }

  setText(value: string) {
    this.countAsText.next(value);
  }

  incrementNumber() {
    let newValue = this.countAsNumber.getValue() + 1;
    if (newValue > 9) {
      newValue = 0;
    }
    this.setText(nrToStr(newValue));
  }

  handleTextChange(value: string) {
    this.setText(value);
  }
}

function nrToStr(nr: number): string {
  switch (nr) {
    case 0:
      return 'zero';
    case 1:
      return 'one';
    case 2:
      return 'two';
    case 3:
      return 'three';
    case 4:
      return 'four';
    case 5:
      return 'five';
    case 6:
      return 'six';
    case 7:
      return 'seven';
    case 8:
      return 'eight';
    case 9:
      return 'nine';
    default:
      return 'zero';
  }
}

function nrStrToNr(str: string): number {
  switch (str) {
    case 'zero':
      return 0;
    case 'one':
      return 1;
    case 'two':
      return 2;
    case 'three':
      return 3;
    case 'four':
      return 4;
    case 'five':
      return 5;
    case 'six':
      return 6;
    case 'seven':
      return 7;
    case 'eight':
      return 8;
    case 'nine':
      return 9;
    default:
      return NaN;
  }
}

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