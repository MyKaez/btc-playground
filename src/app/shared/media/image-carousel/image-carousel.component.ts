import { _getFocusedElementPierceShadowDom } from '@angular/cdk/platform';
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { ContentLayoutMode, LayoutService } from 'src/app/pages';

@Component({
  selector: 'app-image-carousel',
  templateUrl: './image-carousel.component.html',
  styleUrls: ['./image-carousel.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ImageCarouselComponent implements OnInit {
  @Input("image-urls")
  imageUrls: string[] = [];

  @Input("interval")
  interval = 10000;

  slides: Slide[] = [];

  constructor(private layoutService: LayoutService) {
  }

  ngOnInit(): void {
    if (this.layoutService.currentLayoutMode === ContentLayoutMode.ImageCarousel) {
      this.slides = this.imageUrls.map(url => this.getSlide(url));
    } else if (this.layoutService.currentLayoutMode === ContentLayoutMode.LockImage) {
      this.slides = [this.getSlide(this.imageUrls[0])];
    }
  }

  getSlide(url: string): any {
    return {
      title: url.split("/")[1].split(".")[0],
      src: url
    };
  }

  onItemChange($event: any): void {
    console.log('Carousel onItemChange', $event);
  }
}

export interface Slide {
  src: string;
  title: string;
}