import { Injectable } from "@angular/core";
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { map, share, shareReplay } from "rxjs/operators";
import { Observable } from "rxjs";

@Injectable()
export class LayoutService {
  readonly maxSmallScreenWidthPx = 999;

  currentLayoutMode = ContentLayoutMode.ImageCarousel;
  lockedImage: string = "assets/img/wallpapers/fixed-smooth-wireframe.png";
  isHandset$: Observable<boolean>;
  /** Updates if screen width is adjusted and below defined small screen width */
  isSmallScreen$: Observable<boolean>;
  isSimulation = false;

  constructor(private breakpointObserver: BreakpointObserver) {
    this.isHandset$ = breakpointObserver.observe(Breakpoints.Handset)
      .pipe(
        map(result => result.matches),
        shareReplay()
      );

    this.isSmallScreen$ = breakpointObserver.observe([
      `(max-width: ${this.maxSmallScreenWidthPx}px)`
    ]).pipe(
      map(result => result.matches),
      shareReplay(1)
    );
  }

  setLayoutMode(mode: ContentLayoutMode) {
    this.currentLayoutMode = mode;
  }
}

export enum ContentLayoutMode {
  Plane,
  ImageCarousel,
  LockImage
}
