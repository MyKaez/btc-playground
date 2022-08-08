import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-vid',
  templateUrl: './vid.component.html',
  styleUrls: ['./vid.component.scss']
})
export class VidComponent {
  private link?: SafeResourceUrl;

  constructor(private sanitizer: DomSanitizer) {
  }

  @Input()
  public video: string = '';

  public get videoLink(): SafeResourceUrl {
    if (!this.link) {
      this.link = this.sanitizer.bypassSecurityTrustResourceUrl(this.video);
    }
    return this.link;;
  }
}
