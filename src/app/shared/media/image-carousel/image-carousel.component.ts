import { _getFocusedElementPierceShadowDom } from '@angular/cdk/platform';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EmbeddedViewRef, Input, OnInit, SimpleChanges, TemplateRef, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { Observable, pipe } from 'rxjs';
import { ContentLayoutMode, LayoutService } from 'src/app/pages';
import { deprecate } from 'util';

@Component({
  selector: 'app-image-carousel',
  templateUrl: './image-carousel.component.html',
  styleUrls: ['./image-carousel.component.scss']
})
export class ImageCarouselComponent implements OnInit {
  @Input("image-urls") imageUrls: string[] | null = ["assets/img/wallpapers/fixed-smooth-wireframe.png"];
  @Input("interval") interval = 10000;

  slides: {
    title: string;
    src: string;
  }[] = [];

  get getSlides() {
    return this.imageUrls?.map(url => this.getSlide(url)) || [];
  }

  constructor(
    private changeDetection: ChangeDetectorRef,
    private layout: LayoutService) {
  }

  ngOnInit(): void {
    this.slides = this.layout.allImages.map(this.getSlide);
    this.registerSlideEvents();
  }

  getSlide(url: string) {
    return {
      title: url.split("/")[url.split("/").length - 1].split(".")[0],
      src: url
    };
  }

  showNextSlide() {
    (document.querySelector(".carousel-control-next") as HTMLElement).click();
  }

  /**
   * @deprecated this method had as testing purpose and will be left alive for future references
   * @description add to c-carousel as: (itemChange)="onItemChange($event)"
   */
  onItemChange($event: any): void {
    console.log('Carousel onItemChange', $event);
  }

  private registerSlideEvents() {
    let wasCurrentlyTouched = false;
    
    window.ontouchend = touchEvent => {
      if(wasCurrentlyTouched) {
        wasCurrentlyTouched = false;
        this.showNextSlide();
        return;
      }

      wasCurrentlyTouched = true;
      window.setTimeout(() => {
        wasCurrentlyTouched = false;
      }, 750);
    }; 

    window.onkeyup = keyEvent => keyEvent.key == "c" && this.showNextSlide();
  }
}

export interface Slide {
  src: string;
  title: string;
}