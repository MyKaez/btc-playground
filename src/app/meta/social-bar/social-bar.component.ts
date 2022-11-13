import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-social-bar',
  templateUrl: './social-bar.component.html',
  styleUrls: ['./social-bar.component.scss']
})
export class SocialBarComponent implements OnInit {
  socialLinks: ImageLink[] = [];

  constructor() { }

  ngOnInit(): void {
    this.socialLinks = this.getSocialLinks();
  }

  private getSocialLinks(): ImageLink[] {
    return [{
      href: "https://twitter.com/bitty_kn",
      src: "assets/twitter_white.svg",
      alt: "bitty_kn"
    }, {

      href: "https://github.com/MyKaez/btc-playground",
      src: "assets/GitHub-Mark-Light-64px.png"
    }, {
      href: "https://www.youtube.com/channel/UC08NXXwbdkZRWSwFOYRSrDA",
      src: "https://cdn.cdnlogo.com/logos/y/57/youtube-icon.svg",
      alt: "Orange Relationship Youtube Channel"
    },{
      href:'https://drive.google.com/drive/folders/1dvoWCAcgsuv3Xf7AADXFmh7qoFdWTgI2',
      src: 'https://www.iconninja.com/files/562/581/211/logo-brand-network-social-gdrive-icon.svg',
      alt: 'Nico`s GDrive'
    }]
  }
}

export interface ImageLink {
  src: string;
  href: string;
  alt?: string;
}
