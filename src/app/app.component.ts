import { CommonModule } from '@angular/common';
import { Component, Signal, ViewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, fromEvent, map, Observable, scan, tap } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h1>{{ title }}</h1>
    <div #main>MAIN</div>
    <div>{{ observableForView$ | async }}</div>
    <div>{{ bhvSubject$ | async }}</div>
  `,
})
export class AppComponent {
  // get div element with document
  @ViewChild('main')
  mainViewChild: any;

  title = 'learn-rxjs';
  main: HTMLElement | null = null;

  observableForView$: Observable<any> | null = null;
  bhvSubject$: BehaviorSubject<any>;
  mySignal: Signal<any> | null = null;

  constructor() {
    console.log('AppComponent constructor');

    this.bhvSubject$ = new BehaviorSubject(0);
  }

  ngAfterViewInit() {
    // console.log('AppComponent ngOnInit');
    // console.log('mainViewChild', this.mainViewChild);
    // this.main = this.mainViewChild.nativeElement;
    // console.dir(this.main);
    // console.dir(window.document);

    const clickObservable$ = fromEvent(window.document, 'click');
    this.observableForView$ = clickObservable$.pipe(
      map((event) => event),
      tap((event) => console.log(event)),
      tap(() => this.bhvSubject$.next(this.bhvSubject$.value + 1))
    );

    this.mySignal = toSignal(this.observableForView$);

    // const subscription = this.observableForView$
    //   .pipe(scan((count) => count + 1, 0))
    //   .subscribe((count) => console.log(`Clicked ${count} times`));

    // console.log('subscription', subscription);
  }
}
