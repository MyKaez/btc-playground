import { Injectable } from "@angular/core";
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { map, share, shareReplay, take } from "rxjs/operators";
import { Observable, Observer, Subject, Subscriber } from "rxjs";

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

  allImages = [... new Set([
    ...this.imageSets.calm, 
    ...this.imageSets.fancy, 
    ...this.imageSets.simple])];
  
  private observeLayoutMode = new Subject<ContentLayoutMode>();
  layoutMode$ = this.observeLayoutMode.asObservable();

  private observeBackgroundImages = new Subject<string[]>();
  backgroundImages$ = this.observeBackgroundImages.asObservable(); 

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

    this.setLayoutMode(ContentLayoutMode.ImageCarousel);
  }

  setLayoutMode(mode: ContentLayoutMode, backgroundImageOptions?: ContentLayoutBackgroundImageOptions) {
    this.observeLayoutMode.next(mode);
    backgroundImageOptions = backgroundImageOptions || this.defaultOptions[mode];

    let nextImages: string[] = [];
    this.backgroundImages$.pipe(take(1)).subscribe(currentImages => nextImages = currentImages);
    if(backgroundImageOptions.imageMode != null) nextImages = this.imageSets[backgroundImageOptions.imageMode];
    if(backgroundImageOptions.imageUrls) nextImages = backgroundImageOptions.imageUrls;

    let maxImageCount = Number.MAX_SAFE_INTEGER;
    if(mode == ContentLayoutMode.LockImage) maxImageCount = 1;
    else if (mode == ContentLayoutMode.Plane) maxImageCount = 0;

    nextImages = nextImages.slice(0, maxImageCount);
    this.observeBackgroundImages.next(nextImages);
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
