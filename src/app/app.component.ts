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
  of,
  take,
  tap,
  timer,
} from 'rxjs';
import { SafeSubscriber } from 'rxjs/internal/Subscriber';

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
    console.log('TryTwoComponent');
    this.regularWay();
    this.rxjsWay();
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

@Component({
  selector: 'app-try-three',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h1>Try Three Component</h1>
    <div>valueA: {{ valueA }}</div>
  `,
})
export class TryThreeComponent {
  valueA = 0;

  constructor() {}

  ngOnInit() {
    window.setTimeout(() => {
      console.log('TryThreeComponent');
      //this.regularWay();
      this.rxjsWay();
    }, 100);
  }

  private regularWay() {
    // define a function
    const myFunction = () => {
      window.setTimeout(() => {
        console.log('reg1');
        window.setTimeout(() => {
          console.log('reg2');
          window.setTimeout(() => {
            console.log('reg3');
          }, 100);
        }, 100);
      }, 100);
    };

    // call the function
    myFunction();
  }

  private rxjsWay() {
    const interval100ms$ = interval(100);

    //const takeFourNumbers = numbers.pipe(take(3));
    const interval100msTakeThree$ = interval100ms$.pipe(
      take(3),
      map((x) => x + 1),
      map((x) => `rx${x}`)
    );

    const sub = interval100msTakeThree$.subscribe((x) => console.log(x));

    // we don't need to unsubscribe because take(3) will complete the observable
  }
}

@Component({
  selector: 'app-try-four',
  standalone: true,
  imports: [CommonModule],
  template: ` <h1>Try Four Component</h1> `,
})
export class TryFourComponent {
  ngOnInit() {
    this.regularWay();
    this.rxJSWay();
  }

  regularWay() {
    const logSomething = (arg: any) => {
      console.log(arg);
    };

    function subscribeToObservable(subscriber: any) {
      const intervalId = setInterval(() => {
        subscriber.next('hi');
      }, 300);

      return function unsubscribe() {
        clearInterval(intervalId);
      };
    }

    // we wrap the logSomething function in an observer object
    const observer = { next: logSomething };

    // we call the subscribeToObservable function with the observer
    const unsubscribe = subscribeToObservable(observer);

    // unsubscribe after 2 seconds
    setTimeout(() => {
      console.log('unsubscribing');
      unsubscribe();
    }, 2000);
  }

  rxJSWay() {
    const logSomething = (arg: any) => {
      console.log(arg);
    };

    const myObservable$ = new Observable((subscriber) => {
      // Keep track of the interval resource
      const intervalId = setInterval(() => {
        subscriber.next('hi');
      }, 300);

      // Every observable should return an unsubscribe function.
      // E.g. here we return a function that clears the interval resource.
      return () => {
        clearInterval(intervalId);
      };
    });

    const mySubscription = myObservable$.subscribe(logSomething);

    // unsubscribe after 2 seconds
    setTimeout(() => {
      console.log('unsubscribing');
      mySubscription.unsubscribe();
    }, 2000);
  }
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, TryTwoComponent, TryThreeComponent, TryFourComponent],
  template: `<app-try-four></app-try-four>`,
})
export class AppComponent {}