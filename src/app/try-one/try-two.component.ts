import { CommonModule } from '@angular/common';
import { Component, Signal, ViewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, fromEvent, map, Observable, tap } from 'rxjs';

@Component({
  selector: 'app-try-two',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h1>Try Two Component</h1>
    <div>valueA: {{ valueA }}</div>
  `,
})
export class TryTwoComponent {
  valueA = 0;

  constructor() {}

  ngOnInit() {
    this.rxjsWay();
    this.regularWay();
  }

  private regularWay() {
    // define a function
    const myFunction = () => {
      console.log('reg1');
      console.log('reg2');
      console.log('reg3');
    };

    // call the function
    myFunction();
  }

  private rxjsWay() {
    // define an observable
    const myObservable$ = new Observable((subscriber) => {
      subscriber.next('rx1');
      subscriber.next('rx2');
      subscriber.next('rx3');
    });

    // "call" the observable
    const mySubcription = myObservable$.subscribe((value) => {
      console.log(value);
    });

    // unsubscribe
    mySubcription.unsubscribe();
  }
}
