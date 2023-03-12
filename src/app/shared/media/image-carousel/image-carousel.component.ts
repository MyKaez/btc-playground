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
  @Input('wRecreateViewKey') key: any;
  
  viewRef?: EmbeddedViewRef<any>;

  slides: {
    title: string;
    src: string;
  }[] = [];

  get getSlides() {
    return this.imageUrls?.map(url => this.getSlide(url)) || [];
  }

  constructor(
    private changeDetection: ChangeDetectorRef,
    private templateRef: TemplateRef<any>, 
    private viewContainer: ViewContainerRef) {
  }

  ngOnInit(): void {
    window.setTimeout(() => {
      this.slides = [
        {
            "title": "fixed-crystals",
            "src": "assets/img/wallpapers/fixed-crystals.png"
        },
        {
            "title": "fixed-cascade",
            "src": "assets/img/wallpapers/fixed-cascade.png"
        }
      ]}, 2000);   

    window.setTimeout(() => {
      this.slides = [
        {
            "title": "fixed-blur",
            "src": "assets/img/wallpapers/fixed-smooth-blur.png"
        },
        {
            "title": "fixed-wireframe",
            "src": "assets/img/wallpapers/fixed-smooth-wireframe.png"
        }
      ]}, 5000);
  }

  getSlide(url: string) {
    return {
      title: url.split("/")[url.split("/").length - 1].split(".")[0],
      src: url
    };
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if ("imageUrls" in changes) {
      let currentImages = changes["imageUrls"].currentValue as string[];
      this.slides = currentImages?.map(this.getSlide) || [];
      console.log("in carousel", this.slides);
      if (this.viewRef) {
        this.destroyView();
      }

      this.createView();
    }
  }

  private createView() {
    this.viewRef = this.viewContainer.createEmbeddedView(this.templateRef);
  }

  private destroyView() {
    this.viewRef?.destroy();
    this.viewRef = undefined;
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