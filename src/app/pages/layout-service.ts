import { Injectable } from "@angular/core";
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { map, share, shareReplay } from "rxjs/operators";
import { Observable } from "rxjs";

@Injectable()
export class LayoutService {
  readonly maxSmallScreenWidthPx = 999;

  imageSets = {
    fancy: [
      "assets/img/wallpapers/fixed-crystals.png",
      "assets/img/wallpapers/fixed-cascade.png"
    ],
    calm: [
      "assets/img/wallpapers/fixed-smooth-blur.png",
      "assets/img/wallpapers/fixed-smooth-net.png",
      "assets/img/wallpapers/fixed-smooth-nodes.png",
      "assets/img/wallpapers/fixed-smooth-prisma.png",
      "assets/img/wallpapers/fixed-smooth-wireframe.png"
    ],
    simple: [      
      "assets/img/wallpapers/fixed-smooth-wireframe.png",
      "assets/img/wallpapers/fixed-smooth-nodes.png"
    ]
  };
  
  currentLayoutMode = ContentLayoutMode.ImageCarousel;
  currentBackgroundImages = this.imageSets.fancy;

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

  setLayoutMode(mode: ContentLayoutMode, backgroundImageOptions?: ContentLayoutBackgroundImageOptions) {
    this.currentLayoutMode = mode;
    backgroundImageOptions = backgroundImageOptions || this.defaultOptions[mode];

    if(backgroundImageOptions.imageMode != null) this.currentBackgroundImages = this.imageSets[backgroundImageOptions.imageMode];
    if(backgroundImageOptions.imageUrls) this.currentBackgroundImages = backgroundImageOptions.imageUrls;

    let maxImageCount = Number.MAX_SAFE_INTEGER;
    if(mode == ContentLayoutMode.LockImage) maxImageCount = 1;
    else if (mode == ContentLayoutMode.Plane) maxImageCount = 0;

    this.currentBackgroundImages = this.currentBackgroundImages.slice(0, maxImageCount);
  }
  
  defaultOptions: Record<ContentLayoutMode, ContentLayoutBackgroundImageOptions> = {
    [ContentLayoutMode.Plane]: {},
    [ContentLayoutMode.ImageCarousel]: {imageMode: ContentLayoutImageMode.Calm},
    [ContentLayoutMode.LockImage]: {imageMode: ContentLayoutImageMode.Calm}
  };
}

export enum ContentLayoutMode {
  Plane,
  ImageCarousel,
  LockImage
}

export enum ContentLayoutImageMode {
  Fancy = "fancy",
  Calm = "calm",
  Simple = "simple"
}

export interface ContentLayoutBackgroundImageOptions {
  imageMode?: ContentLayoutImageMode;
  imageUrls?: string[];
}
