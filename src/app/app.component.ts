import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss', './materials.scss']
})
export class AppComponent {
  title = 'The Bitcoin Playground';

  constructor(private router: Router) {

  }

  navigateTo(link: string): void {
    this.router.navigate(['/' + link]);
  }
}
