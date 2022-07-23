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

  constructor(private router: Router) {
    SimpleViewComponent.app = this;
  }

  get currentRoute(): string {
    let parts = window.location.href.split('/');
    let res = parts[parts.length - 1];
    return res;
  }

  ngOnInit(): void {
    let route = this.currentRoute;
    if (this.currentRoute === '') {
      route = 'simple-home';
    }
    this.navigateTo(route);
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
    this.navigateTo(this.currentRoute);
  }

  navigateTo(link: string): void {
    if (this.simpleView) {
      if (!link.startsWith('simple-')) {
        link = 'simple-' + link;
      } else {
        link = link;
      }
    } else {
      if (link.startsWith('simple-')) {
        link = link.replace('simple-', '');
      } else {
        link = link;
      }
    }
    this.router.navigate(['/' + link]);
  }
}
