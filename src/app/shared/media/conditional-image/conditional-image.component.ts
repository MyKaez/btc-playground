import { Component, Input, OnInit } from '@angular/core';
import { WebHelper } from 'src/model/web';

@Component({
  selector: 'app-conditional-image',
  templateUrl: './conditional-image.component.html',
  styleUrls: ['./conditional-image.component.scss']
})
export class ConditionalImageComponent implements OnInit {
  @Input("default-image-src")
  defaultImageSrc: string = "";

  @Input("hover-image-src")
  hoverImageSrc?: string;

  @Input("click-image-src")
  clickImageSrc?: string;

  isClicked = false;

  constructor() { }

  ngOnInit(): void {
  }

  async onClick() {
    this.isClicked = true;
    await WebHelper.waitSeconds(3);
    this.isClicked = false;
  }
}
