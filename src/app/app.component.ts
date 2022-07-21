import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SimpleViewComponent } from './simple-view/simple-view.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss', './materials.scss']
})
export class AppComponent implements OnInit {
  title: string = 'The Bitcoin Playground';

  private realLink: string = 'home';

  constructor(private router: Router) {
    SimpleViewComponent.app = this;
  }

  ngOnInit(): void {
    this.navigateTo('home');
  }

  public get simpleView(): boolean {
    let val = localStorage.getItem('app_simple_view') ?? 'true';
    if (val === 'true') {
      return true;
    } else {
      return false;
    }
  }

  public set simpleView(value: boolean) {
    localStorage.setItem('app_simple_view', value ? 'true' : 'false');
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
