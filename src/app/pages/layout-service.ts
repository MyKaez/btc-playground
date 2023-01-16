import {Injectable} from "@angular/core";
import {BreakpointObserver, Breakpoints} from "@angular/cdk/layout";
import {map, shareReplay} from "rxjs/operators";
import {Observable} from "rxjs";

@Injectable()
export class LayoutService {
  currentLayoutMode = ContentLayoutMode.ImageCarousel;
  lockedImage: string = "assets/img/fixed-crystals.png";
  isHandset: Observable<boolean>;
  isSimulation = false;

  constructor(private breakpointObserver: BreakpointObserver) {
    this.isHandset = breakpointObserver.observe(Breakpoints.Handset)
      .pipe(
        map(result => result.matches),
        shareReplay()
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
