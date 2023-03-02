import { _getFocusedElementPierceShadowDom } from '@angular/cdk/platform';
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { ContentLayoutMode, LayoutService } from 'src/app/pages';
import { deprecate } from 'util';

@Component({
  selector: 'app-image-carousel',
  templateUrl: './image-carousel.component.html',
  styleUrls: ['./image-carousel.component.scss']
})
export class ImageCarouselComponent implements OnInit {
  @Input("image-urls")
  imageUrls: string[] = [];

  @Input("interval")
  interval = 10000;

  slides: Slide[] = [];

  constructor() {
  }

  ngOnInit(): void {
    this.slides = this.imageUrls.map(url => this.getSlide(url));
  }

  getSlide(url: string): any {
    return {
      title: url.split("/")[1].split(".")[0],
      src: url
    };
  }

  /**
   * @deprecated this method had as testing purpose and will be left alive for future references
   * @description add to c-carousel as: (itemChange)="onItemChange($event)"
   */
  onItemChange($event: any): void {
    console.log('Carousel onItemChange', $event);
  }
}

export interface Slide {
  src: string;
  title: string;
}