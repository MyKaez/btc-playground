import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss', './materials.scss']
})
export class AppComponent {

  title: string = 'The Bitcoin Playground';
  simpleView: boolean = true;

  constructor(private router: Router) {

  }

  switchMode() {
    this.simpleView = !this.simpleView;
  }

  navigateTo(link: string): void {
    this.router.navigate(['/' + link]);
  }
}
