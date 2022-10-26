import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

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

  constructor() {
  }

  ngOnInit(): void {
    this.slides = this.imageUrls.map(url => ({
      title: url.split("/")[1].split(".")[0],
      src: url
    }));
  }
  
  onItemChange($event: any): void {
    console.log('Carousel onItemChange', $event);
  }
}

export interface Slide {
  src: string;
  title: string;
}