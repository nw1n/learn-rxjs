import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  EventEmitter,
  Input,
  input,
  model,
  Output,
  output,
  signal,
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
  Subscription,
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
    <input
      type="text"
      [ngModel]="countAsText | async"
      (ngModelChange)="handleTextChange($event)"
    />
    <p>countAsText: {{ countAsText | async }}</p>
    <p>countAsNumber: {{ countAsNr | async }}</p>
    <button (click)="incrementNumber()">increment</button>
  `,
})
export class TheChildComponent {
  externalNr = input<number | null>(0);

  countAsText = new BehaviorSubject<string>('one');
  countAsNr = new BehaviorSubject<number>(0);
  textChange$: Observable<string> = this.countAsText.asObservable();
  textChangeAsNr$: Observable<number> = this.textChange$.pipe(map(nrStrToNr));
  externalNrChange$: Observable<number | null> = toObservable(this.externalNr);

  @Output()
  numberChange = new EventEmitter<number>();

  sub1: Subscription | null = null;
  sub2: Subscription | null = null;
  sub3: Subscription | null = null;

  constructor() {
    this.sub1 = this.textChangeAsNr$.subscribe((val: any) => {
      this.countAsNr.next(val);
    });

    this.sub2 = this.countAsNr.subscribe((val: any) => {
      this.numberChange.emit(val);
    });

    this.sub3 = this.externalNrChange$.subscribe((val: any) => {
      if (Number.isNaN(val)) {
        return;
      }
      this.setTextIfNotSame(nrToStr(val));
    });
  }

  ngOnInit() {
    // this will log the initial value of the component
    console.log('OnInit ChildState:', this.countAsText.getValue());
    // this will log the external value that is passed to the component
    setTimeout(() => {
      console.log('OnInit ChildState async:', this.countAsText.getValue());
    });
  }

  ngAfterViewInit() {}

  ngOnDestroy() {
    console.log('OnDestroy Child');
    console.log(this.sub1);

    this.sub1?.unsubscribe();
    this.sub2?.unsubscribe();
    this.sub3?.unsubscribe();

    console.log(this.sub1);
  }

  setTextIfNotSame(value: string) {
    if (this.countAsText.getValue() === value) {
      return;
    }
    this.countAsText.next(value);
  }

  incrementNumber() {
    let newValue = this.countAsNr.getValue() + 1;
    if (newValue > 9) {
      newValue = 0;
    }
    this.setTextIfNotSame(nrToStr(newValue));
  }

  handleTextChange(value: string) {
    this.setTextIfNotSame(value);
  }
}

@Component({
  selector: 'example-component',
  standalone: true,
  imports: [CommonModule, TheChildComponent],
  template: `
    <h1>Example</h1>
    <p>outerNumber: {{ outerNr | async }}</p>
    <button (click)="incrementOutterNumber()">increment outer</button
    ><br /><br />
    <button (click)="toggleChild()">toggle child</button>
    @if(showChild) {
    <child-component
      (numberChange)="handleChildNumberChange($event)"
      [externalNr]="outerNr | async"
    ></child-component>
    }
  `,
})
export class ExampleComponent {
  outerNr = new BehaviorSubject<number>(7);
  showChild = true;

  handleChildNumberChange(value: any) {
    console.log('handleChildNumberChange', value);
    if (this.outerNr.getValue() === value) {
      return;
    }
    this.outerNr.next(value);
  }

  incrementOutterNumber() {
    let newValue = this.outerNr.getValue() + 1;
    if (newValue > 9) {
      newValue = 0;
    }
    this.outerNr.next(newValue);
  }

  toggleChild() {
    this.showChild = !this.showChild;
  }
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ExampleComponent],
  template: `<div style="padding: 30px;">
    <example-component></example-component>
  </div>`,
})
export class AppComponent {}

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
      return 'Nan';
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
