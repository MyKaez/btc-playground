import {Injectable} from "@angular/core";

@Injectable()
export class LayoutService {
  currentLayoutMode = ContentLayoutMode.ImageCarousel;
  lockedImage: string = "assets/img/fixed-crystals.png";
  contentWrapperClass: string = 'content-wrapper';

  setLayoutMode(mode: ContentLayoutMode) {
    this.currentLayoutMode = mode;
  }

  isSimulation(simulation: boolean): void {
    if (simulation) {
      this.contentWrapperClass = 'content-wrapper content-simulation';
    } else {
      this.contentWrapperClass = 'content-wrapper';
    }
  }

  getWrapperClass(): string {
    return this.contentWrapperClass;
  }
}

export enum ContentLayoutMode {
  Plane,
  ImageCarousel,
  LockImage
}
