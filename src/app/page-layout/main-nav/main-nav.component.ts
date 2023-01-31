import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
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

  isCarousel = () => this.layout.currentLayoutMode == ContentLayoutMode.ImageCarousel;
  isLockImage = () => this.layout.currentLayoutMode == ContentLayoutMode.LockImage;
  lockedImage = () => this.layout.lockedImage;

  constructor(private router: Router,
    public layout: LayoutService,
    private btcService: BtcService,
    private dialog: MatDialog) {
    this.navLinks = this.getNavLinks();
    this.isHandset$ = layout.isHandset;
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
    }, 1000);
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
  "./assets/img/fixed-crystals.png",
  "./assets/img/fixed-cascade.png",
  "./assets/img/fixed-connected.png"
]
