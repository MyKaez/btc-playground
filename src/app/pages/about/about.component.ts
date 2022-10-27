import { Component, OnInit } from '@angular/core';
import { ContentLayoutMode, LayoutService } from '../layout-service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  contacts: ContactDescription[] = [];

  constructor(private layout: LayoutService) { }

  ngOnInit(): void {
    this.layout.setLayoutMode(ContentLayoutMode.ImageCarousel);
    this.contacts = this.getContactDescriptions();
    // double contacts for testing
    this.contacts = [... this.contacts, ... this.contacts];
  }

  private getContactDescriptions(): ContactDescription[] {
    return [{
        name: "Nolan Grayson",
        description: "Omni-Man, 55",
        imageSrc: "assets/omniman.png",
        quote: "That's the neat thing, you don't",
        paragraphs: [
          "Nolan Grayson, besser als der Superheld Omni-Man bekannt, ist der Hauptschurke der 2021 erschienenen Animationsserie Invincible, die auf der gleichnamigen Comic-Serie von Robert Kirkman basiert.",
          "Er wurde im Original von J. K. Simmons gesprochen. In der deutschen Fassung wurde er von Thomas Nero Wolff synchronisiert."
        ],
        cites: [
          "Sieh dir an, was sie brauchen um einen Bruchteil unserer Macht nachzuahmen! Es ist richtig, sie zu bemitleiden, aber falsch, sie deinem eigenen Volk vorzuziehen!"
        ]
      }, {
        name: "Terry Jeffords",
        description: "Sergeant, 54",
        imageSrc: "assets/terryjeffords.jpg",
        quote: "Niemand geht an meinen Joghurt!",
        paragraphs: [
          "Terry ist fürsorglich, beschützt die Truppe und ist fleißig. Er hat die Angewohnheit, sich auf die dritte Person zu beziehen. Als er Zwillingstöchter hatte, flippte er aus und hatte Angst, sich zu verletzen, aber bald genug zeigte er sich als harter, heldenhafter, furchterregender Mann, der alles tun würde, um seine Truppe zu schützen.",
          "Er beschuldigte furchtlos einen bewaffneten Verbrecher, zweimal Captain Holts Leben gerettet zu haben, und als Jake, Charles und Gina mit einbrechenden Terroristen in einem Geschäft gefangen waren, widersetzte sich Terry den Anweisungen, um ihre Gefährdung zu verhindern - er widersetzte sich offen Detective Pembroke um ihn daran zu hindern, seine Freunde zu gefährden. Holt sieht in Terry das Potenzial, ein Kapitän zu sein, und erkennt ihn als einen großartigen Anführer und eine mitfühlende Person an."
        ],
        cites: []
      }
    ]
  }
}

export interface ContactDescription {
  name: string;
  description: string;
  imageSrc: string;
  quote: string;
  cites: string[];
  paragraphs: string[];
}