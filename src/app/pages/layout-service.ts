import { Injectable } from "@angular/core";

@Injectable()
export class LayoutService {
    currentLayoutMode = ContentLayoutMode.ImageCarousel;

    setLayoutMode(mode: ContentLayoutMode) {
        this.currentLayoutMode = mode;
    }
}

export enum ContentLayoutMode {
    Plane,
    ImageCarousel
}