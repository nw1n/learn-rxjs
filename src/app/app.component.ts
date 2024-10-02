import { Component, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { fromEvent, scan } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <h1>{{ title }}</h1>
    <div #main>MAIN</div>
  `,
})
export class AppComponent {
  // get div element with document
  @ViewChild('main')
  mainViewChild: any;

  title = 'learn-rxjs';
  main: HTMLElement | null = null;

  constructor() {
    console.log('AppComponent constructor');
  }

  ngAfterViewInit() {
    // console.log('AppComponent ngOnInit');
    // console.log('mainViewChild', this.mainViewChild);
    // this.main = this.mainViewChild.nativeElement;
    // console.dir(this.main);
    // console.dir(window.document);

    const subscription = fromEvent(document, 'click')
      .pipe(scan((count) => count + 1, 0))
      .subscribe((count) => console.log(`Clicked ${count} times`));

    console.log('subscription', subscription);
  }
}
