import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.scss']
})
export class MainNavComponent {
  navLinks: NavLink[] = [];
  title: string = 'The Bitcoin Playground';
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver, private router: Router) {
    this.navLinks = this.getNavLinks();
  }

  public isLast(part: string): boolean {
    return this.pathParts[this.pathParts.length - 1] == part;
  }

  public get pathParts(): string[] {
    return this.router.url.split('/').filter(p => p && p !== '');
  }

  private getNavLinks(): NavLink[] {
    return [{
      title: "Simulationen",
      href: "simulations"
    },{
      title: "Info",
      href: "info"
    },{
      title: "Über Uns",
      href: "about"
    },{
      title: "Unterstütze uns",
      href: "support"
    }];
  }

  getFullPath(path: string): string {
    const parts = this.pathParts;
    let fullPath = '';
    for (let p of parts) {
      if (fullPath.length > 0) {
        fullPath += '/';
      }
      fullPath += p;
      if (p === path) {
        break;
      }
    }
    return fullPath;
  }

  navigateTo(link: string): void {
    this.router.navigate(['/' + link]);
  }
}


export interface NavLink {
  title: string;
  href: string;
}