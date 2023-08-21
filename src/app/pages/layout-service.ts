import { Injectable } from "@angular/core";
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { map, share, shareReplay, take } from "rxjs/operators";
import { BehaviorSubject, Observable, Observer, Subject, Subscriber } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable()
export class LayoutService {
  readonly maxSmallScreenWidthPx = 999;
  
  readonly defaultOptions: Record<ContentLayoutMode, ContentLayoutBackgroundImageOptions> = {
    [ContentLayoutMode.Plane]: {imageUrls: ["assets/img/wallpapers/fixed-smooth-nodes.png"]},
    [ContentLayoutMode.ImageCarousel]: {imageUrls: ["assets/img/wallpapers/fixed-crystals.png"]},
    [ContentLayoutMode.LockImage]: {imageUrls: ["assets/img/wallpapers/fixed-smooth-wireframe.png"]},
  };

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
  
  private observeLayoutMode = new BehaviorSubject(ContentLayoutMode.ImageCarousel);
  layoutMode$ = this.observeLayoutMode.asObservable();

  private observeBackgroundImages = new BehaviorSubject(this.defaultOptions[0].imageUrls!);
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
    if(environment.debugImages) {
      mode = ContentLayoutMode.ImageCarousel;
      backgroundImageOptions = undefined;
    }

    this.observeLayoutMode.next(mode);
    backgroundImageOptions = backgroundImageOptions || this.defaultOptions[mode];

    // This disables the ability to switch modes, for a simpler experience
    mode = ContentLayoutMode.LockImage;

    let nextImages = this.observeBackgroundImages.getValue();
    if(backgroundImageOptions.imageMode != null) nextImages = this.imageSets[backgroundImageOptions.imageMode];
    if(backgroundImageOptions.imageUrls) nextImages = backgroundImageOptions.imageUrls;

    let maxImageCount = Number.MAX_SAFE_INTEGER;
    if(mode == ContentLayoutMode.LockImage) maxImageCount = 1;
    else if (mode == ContentLayoutMode.Plane) maxImageCount = 0;

    nextImages = nextImages.slice(0, maxImageCount);
    this.observeBackgroundImages.next(nextImages);
  }
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
