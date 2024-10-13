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
    <p>countAsNumber: {{ countAsNumber | async }}</p>
    <button (click)="incrementNumber()">increment</button>
  `,
})
export class TheChildComponent {
  externalNumber = input<number | null>(0);

  countAsText = new BehaviorSubject<string>('one');
  countAsNumber = new BehaviorSubject<number>(0);
  textChange$: Observable<string> = this.countAsText.asObservable();
  textChangeAsNumber$: Observable<number> = this.textChange$.pipe(
    map(nrStrToNr)
  );
  externalNumberChange$: Observable<number | null> = toObservable(
    this.externalNumber
  );

  @Output()
  numberChange = new EventEmitter<number>();

  allSubscriptions: Subscription[] = [];

  constructor() {
    this.allSubscriptions.push(
      this.textChangeAsNumber$.subscribe((val: any) => {
        this.countAsNumber.next(val);
      })
    );

    this.allSubscriptions.push(
      this.countAsNumber.subscribe((val: any) => {
        this.numberChange.emit(val);
      })
    );

    this.allSubscriptions.push(
      this.externalNumberChange$.subscribe((val: any) => {
        if (Number.isNaN(val)) {
          return;
        }
        this.setText(nrToStr(val));
      })
    );
  }

  ngOnInit() {
    console.log('OnInit ChildState', this.countAsText.getValue());
    setTimeout(() => {
      console.log('OnInit ChildState async', this.countAsText.getValue());
    });
  }

  ngAfterViewInit() {}

  ngOnDestroy() {
    this.allSubscriptions.forEach((sub) => {
      console.log(sub);
      sub.unsubscribe();
    });

    setTimeout(() => {
      this.allSubscriptions.forEach((sub) => {
        console.log(sub);
        sub.unsubscribe();
      });
    }, 0);
  }

  setText(value: string) {
    if (this.countAsText.getValue() === value) {
      return;
    }
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

@Component({
  selector: 'example-component',
  standalone: true,
  imports: [CommonModule, TheChildComponent],
  template: `
    <h1>Example</h1>
    <p>outerNumber: {{ outerNumber | async }}</p>
    <button (click)="incrementOutterNumber()">increment outer</button>
    <button (click)="toggleChild()">toggle child</button>
    @if(showChild) {
    <child-component
      (numberChange)="handleChildNumberChange($event)"
      [externalNumber]="outerNumber | async"
    ></child-component>
    }
  `,
})
export class ExampleComponent {
  outerNumber = new BehaviorSubject<number>(7);
  showChild = true;

  handleChildNumberChange(value: any) {
    console.log('handleChildNumberChange', value);
    if (this.outerNumber.getValue() === value) {
      return;
    }
    this.outerNumber.next(value);
  }

  incrementOutterNumber() {
    let newValue = this.outerNumber.getValue() + 1;
    if (newValue > 9) {
      newValue = 0;
    }
    this.outerNumber.next(newValue);
  }

  toggleChild() {
    this.showChild = !this.showChild;
  }
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ExampleComponent],
  template: `<example-component></example-component>`,
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
