import { Component } from '@angular/core';

@Component({
  selector: 'stri-root',
  template: `
  <!--The content below is only a placeholder and can be replaced.-->
  <stri-navbar></stri-navbar>
  <main>
      <router-outlet></router-outlet>
  </main>
  <stri-footer></stri-footer>
  `,
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'stripe-test';
}
