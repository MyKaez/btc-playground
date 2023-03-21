import { Component, OnInit } from '@angular/core';
import { first, map, Observable, share, shareReplay, take, tap } from 'rxjs';
import { Router } from '@angular/router';
import { LayoutService, ContentLayoutMode } from 'src/app/pages';
import { BtcBlock, BtcPrice, BtcService } from 'src/app/shared/helpers/btc.service';
import { MatDialog } from '@angular/material/dialog';
import { DonationComponent } from '../../shared/donation/donation.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.scss']
})
export class MainNavComponent implements OnInit {
  homeImages = HomeBackgroundImages;
  navLinks: NavLink[] = [];
  title: string = 'The Bitcoin Playground';
  isHandset$: Observable<boolean>;
  currentPrice?: BtcPrice;
  latestBlocks: BtcBlock[] = [];

  isCarousel$ = this.layout.backgroundImages$.pipe(map(images => images.length > 1), shareReplay());
  isLockImage$ = this.layout.backgroundImages$.pipe(map(images => images.length === 1), shareReplay());
  firstImage$ = this.layout.backgroundImages$.pipe(map(images => images.length ? images[0] : null), shareReplay());
  images$ = this.layout.backgroundImages$.pipe(map(images => images), share(), tap(i => console.log("new imagess", i)));
  fallbackImages = ["assets/img/wallpapers/fixed-smooth-prisma.png"];

  constructor(private router: Router,
    public layout: LayoutService,
    private btcService: BtcService,
    private dialog: MatDialog) {
    this.navLinks = this.getNavLinks();
    this.isHandset$ = layout.isHandset$;
  }

  get presentationMode(): boolean {
    return environment.presentationMode;
  }

  get currentBlock(): number {
    return this.latestBlocks.length > 0 ? this.latestBlocks[0].height : 0;
  }

  ngOnInit(): void {
    setInterval(() => {
      this.btcService.getCurrentPrice().subscribe(price => this.currentPrice = price);
      this.btcService.getLatestBlocks().subscribe(blocks => this.latestBlocks = blocks);

      let test = this.isCarousel$;
    }, 1000);   
    
    this.layout.backgroundImages$.subscribe(images => console.log("new images", images));
    this.firstImage$.subscribe(value => console.log("Updatedt firstimage", value));
    this.isCarousel$.subscribe(value => console.log("Updatedt isCarousel", value));
    this.isLockImage$.subscribe(value => console.log("Updatedt isLockImage", value));
  }

  isLast(part: string): boolean {
    return this.pathParts[this.pathParts.length - 1] == part;
  }

  get pathParts(): string[] {
    return this.router.url.split('/').filter(p => p && p !== '');
  }

  openDonation() {
    this.dialog.open(DonationComponent);
  }

  private getNavLinks(): NavLink[] {
    return [{
      title: "Simulationen",
      href: "simulations"
    }, {
      title: "Über Uns",
      links: [{
        title: "Über das Team",
        href: "team"
      }, {
        title: "Über das Projekt",
        href: "about"
      }]
    }, {
      title: "Unterstütze Uns",
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

  navigateTo(url: string): Promise<boolean> {
    return this.router.navigate(['/' + url]);
  }

  toggleNavigationEntry(link: NavLink) {
    link.isExpanded = !link.isExpanded;
  }
}

export interface NavLink {
  title: string;
  href?: string;
  links?: NavLink[];
  isExpanded?: boolean;
}

export const HomeBackgroundImages: string[] = [
  "./assets/img/wallpapers/fixed-crystals.png"
]
