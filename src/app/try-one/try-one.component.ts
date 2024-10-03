import { CommonModule } from '@angular/common';
import { Component, Signal, ViewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, fromEvent, map, Observable, tap } from 'rxjs';

@Component({
  selector: 'app-try-one',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2>Try One Component</h2>
    <div #main>MAIN</div>
    <div>{{ observableForView$ | async }}</div>
    <div>{{ bhvSubject$ | async }}</div>
  `,
})
export class TryOneComponent {
  @ViewChild('main')
  mainViewChild: any;

  main: HTMLElement | null = null;

  observableForView$: Observable<any> | null = null;
  bhvSubject$: BehaviorSubject<any>;
  mySignal: Signal<any> | null = null;

  constructor() {
    console.log('TryOneComponent constructor');
    this.bhvSubject$ = new BehaviorSubject(0);
  }

  ngAfterViewInit() {
    const clickObservable$ = fromEvent(window.document, 'click');
    this.observableForView$ = clickObservable$.pipe(
      map((event) => event),
      tap((event) => console.log(event)),
      tap(() => this.bhvSubject$.next(this.bhvSubject$.value + 1))
    );

    this.mySignal = toSignal(this.observableForView$);
  }
}
