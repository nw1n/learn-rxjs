import { CommonModule } from '@angular/common';
import { Component, Signal, ViewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  BehaviorSubject,
  concat,
  concatAll,
  concatMap,
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
import { SafeSubscriber, Subscriber } from 'rxjs/internal/Subscriber';

@Component({
  selector: 'example-component',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h1>Example</h1>
    <button (click)="doChanges()">Increment</button>
    <p>myTemplateVal {{ myTemplateVal }}</p>
    <p>myBhSubject.getValue() {{ myBhSubject.getValue() }}</p>
    <p>myBhSubject async {{ myBhSubject | async }}</p>
    <p>
      myTemplateValThatGetsUpdateBySubject
      {{ myTemplateValThatGetsUpdateBySubject }}
    </p>
    <p>mySimpleSubject async {{ mySimpleSubject | async }}</p>
    <p>
      myObservableThatIsDerivedFromBhSubject async
      {{ myObservableThatIsDerivedFromBhSubject | async }}
    </p>
  `,
})
export class ExampleComponent {
  myTemplateVal = 0;
  myTemplateValThatGetsUpdateBySubject = 0;
  myBhSubject = new BehaviorSubject(0); // a subject is basically just a stateless event emitter
  mySimpleSubject = new Subject<number>();

  // this kind of calls .next immediately after creation with asObservable() if it is a behavioursubject
  // (not if it's a simple subject).
  // then it calls .next whenever the Subject/BehaviorSubject calls .next
  myObservableThatIsDerivedFromBhSubject = this.myBhSubject.asObservable();

  constructor() {
    this.mySimpleSubject.subscribe((val) => {
      this.myTemplateValThatGetsUpdateBySubject = val;
    });
  }

  doChanges() {
    this.myTemplateVal++;
    const newVal = this.myBhSubject.getValue() + 1;
    this.myBhSubject.next(newVal);

    const newVal2 = this.myTemplateValThatGetsUpdateBySubject + 1;
    this.mySimpleSubject.next(newVal2);
  }
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ExampleComponent],
  template: `<example-component></example-component>`,
})
export class AppComponent {}