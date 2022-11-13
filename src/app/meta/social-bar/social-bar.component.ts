import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-social-bar',
  templateUrl: './social-bar.component.html',
  styleUrls: ['./social-bar.component.scss']
})
export class SocialBarComponent implements OnInit {
  socialLinks: SocialIcon[] = [];

  constructor() { }

  ngOnInit(): void {
    this.socialLinks = this.getSocialLinks();
  }

  private getSocialLinks(): SocialIcon[] {
    return [{
      iconName: "test",
      href: "https://twitter.com/bitty_kn",
      imageSrc: "assets/twitter_white.svg",
      alt: "bitty_kn"
    }, {
      iconName: "test",
      href: "https://github.com/MyKaez/btc-playground",
      imageSrc: "assets/GitHub-Mark-Light-64px.png"
    }, {
      iconName: "test",
      href: "https://www.youtube.com/channel/UC08NXXwbdkZRWSwFOYRSrDA",
      imageSrc: "https://cdn.cdnlogo.com/logos/y/57/youtube-icon.svg",
      alt: "Orange Relationship Youtube Channel"
    },{
      iconName: "test",
      href:'https://drive.google.com/drive/folders/1dvoWCAcgsuv3Xf7AADXFmh7qoFdWTgI2',
      imageSrc: 'https://www.iconninja.com/files/562/581/211/logo-brand-network-social-gdrive-icon.svg',
      alt: 'Nico`s GDrive'
    }]
  }
}

export interface SocialIcon {
  href: string;
  iconName: string;
  imageSrc?: string;
  alt?: string;
}
