import { Injectable } from "@angular/core";

@Injectable()
export class LayoutService {
    currentLayoutMode = ContentLayoutMode.ImageCarousel;
    lockedImage: string = "assets/img/fixed-cloud.png";

    setLayoutMode(mode: ContentLayoutMode) {
        this.currentLayoutMode = mode;
    }
}

export enum ContentLayoutMode {
    Plane,
    ImageCarousel,
    LockImage
}