import { CommonModule } from '@angular/common';
import { Component, ElementRef, Signal, ViewChild } from '@angular/core';
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

@Component({
  selector: 'app-regular-click-event',
  standalone: true,
  imports: [CommonModule],
  template: `<h1>app-regular-click-event</h1>
    <button (click)="handleClick()">Click me</button>`,
})
export class RegularClickEventComponent {
  handleClick() {
    console.log('Clicked');
  }
}

@Component({
  selector: 'app-manual-click-event-listener',
  standalone: true,
  imports: [CommonModule],
  template: `<h1>app-manual-click-event-listener</h1>
    <button #btn>Click me</button>`,
})
export class ManualClickEventListenerComponent {
  @ViewChild('btn') btn!: ElementRef;

  ngAfterViewInit() {
    this.btn.nativeElement.addEventListener('click', () => {
      console.log('Clicked');
    });
  }

  ngOnDestroy() {
    this.btn.nativeElement.removeEventListener('click', () => {
      console.log('Clicked');
    });
  }
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RegularClickEventComponent, ManualClickEventListenerComponent],
  template: `<app-regular-click-event /><app-manual-click-event-listener />`,
})
export class AppComponent {}