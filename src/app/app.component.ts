import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  ContentChild,
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
import { Directive } from '@angular/core';
import { V } from '@angular/cdk/keycodes';

@Component({
  selector: 'child-one',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `<h1>Child One</h1>
    <p>count: {{ count }}</p>`,
})
export class ChildOneComponent {
  public readonly count = signal(0);

  sayHello() {
    console.log('Hello');
  }

  constructor() {}
}

@Component({
  selector: 'child-two',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `<h1>Child Two</h1>`,
})
export class ChildTwoComponent {}

@Directive({
  selector: '[binder]',
  standalone: true,
})
export class BinderDirective {
  // childOne: ChildOneComponent | null = null;
  // childTwo: ChildTwoComponent | null = null;

  @ContentChild(ChildOneComponent) childOne!: ChildOneComponent;
  @ContentChild(ChildTwoComponent) ChildTwo!: ChildTwoComponent;

  constructor() {
    console.log('BinderDirective created');
    console.log(this.childOne);
  }

  ngAfterContentInit(): void {
    // This is when the content children are available
    console.log('ngAfterContentInit');
    console.log(this.childOne);
    this.childOne.count.set(this.childOne.count() + 1);
    this.childOne.sayHello();
  }
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    ChildOneComponent,
    ChildTwoComponent,
    BinderDirective,
  ],
  template: `<div style="padding: 30px;">
    <h1>Parent</h1>
    <div binder>
      <child-one></child-one>
      <child-two></child-two>
    </div>
  </div>`,
})
export class AppComponent {}
