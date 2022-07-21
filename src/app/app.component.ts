import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss', './materials.scss']
})
export class AppComponent {
  title: string = 'The Bitcoin Playground';
  simpleView: boolean = true;

  private realLink: string = 'home';

  constructor(private router: Router, private route: ActivatedRoute) {

  }

  switchMode() {
    this.simpleView = !this.simpleView;
    this.navigateTo(this.realLink);
  }

  navigateTo(link: string): void {
    if (this.simpleView) {
      if (!link.startsWith('simple-')) {
        this.realLink = 'simple-' + link;
      } else {
        this.realLink = link;
      }
    } else {
      if (link.startsWith('simple-')) {
        this.realLink = link.replace('simple-', '');
      } else {
        this.realLink = link;
      }
    }
    this.router.navigate(['/' + this.realLink]);
  }
}
