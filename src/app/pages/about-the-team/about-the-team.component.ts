import { Component, OnInit } from '@angular/core';
import { ContentLayoutMode, LayoutService } from '../layout-service';

@Component({
  selector: 'app-about-the-team',
  templateUrl: './about-the-team.component.html',
  styleUrls: ['./about-the-team.component.scss']
})
export class AboutTheTeamComponent implements OnInit {
  contacts: ContactDescription[] = [];
  
  constructor(private layout: LayoutService) { }

  ngOnInit(): void {
    this.layout.setLayoutMode(ContentLayoutMode.Plane);
  
    this.contacts = this.getContactDescriptions();
  }

  private getContactDescriptions(): ContactDescription[] {
    return [{
        name: "Danny",
        description: "geb. 1989",
        imageSrc: "assets/img/personal/danny.png",
        quote: "Bitcoin, there is no second best.",
        paragraphs: [
          `Aktuell mint er Fiat als Elektrotechnik-Ingenieur.
          Außerhalb der „normalen Arbeit“ startete er im Jahr 2021 einen Podcast  „Orange Relationship“ - der Name soll hierbei auf die täglichen Gedanken verweisen, welche er rundum Bitcoin hat.`,
          "Ein paar Monate später (Ende 2021) wurde der gleichnamige YouTube-Kanal aktiviert und dient bis heute als Plattform wöchentlichen Bitcoin-Contents. Im Rahmen des YouTube-Projektes programmierte Danny die ersten Simulationen und erklärte diese in seinen Videos, was eine hohe Nachfrage und ein paar Iterationen weiter FixesTh.is als Resultat hatte."
        ],
        cites: [
          "Uiiii, das ist der richtig heße shit!"
        ]
      }, {
        name: "Kenny",
        description: "geb. 1989",
        imageSrc: "assets/img/personal/missing.png",
        quote: "Let`s BitGenialitääät",
        paragraphs: [
          `Warum ist der Rand vom Käse schon wieder hart 
          Und warum ist der Hamster gestorben? 
          Warum hat der Hund den Haufen mitten auf die Wiese gemacht `,
          `Und warum stinkt das? 
          Warum können wir nicht auf Bären zur Arbeit reiten 
          Und warum ist der Nachbar so laut?`
        ],
        cites: ["Gibts'n Ticket dafür?"]
      }, {
        name: "Sarah K.",
        description: "geb. 1995",
        imageSrc: "assets/img/personal/sarah.png",
        quote: "Do your own proof of work",
        paragraphs: [
          `Sie arbeitet momentan in einem Start up als Product Owner eines digitalen Produktes in einer eher konservativen Branche. Als Product Owner hat sie ihre Vorliebe für das UI/UX Design entdeckt, da sie der Überzeugung ist, dass ein gutes User Interface und eine gute User Experience maßgeblich für den Produkterfolg verantwortlich ist.`,
          `Im Rahmen Ihres Werdegangs hat sie ebenfalls zahlreiche Erfahrungen im Marketing, Service und im Vertrieb aufbauen können. Zu Hause ist sie allerdings momentan in der agilen Softwareentwicklung.`
        ],
        cites: ["danke, passt alles"]
      }, {
        name: "Nico",
        description: "geb. 1991",
        imageSrc: "assets/img/personal/missing.png",
        quote: "Sind wir schon da?",
        paragraphs: [
          `Just within the last hundred years, we humans, inhabitants of a
          small planet orbiting this unexceptional star, have learned where
          the galaxies are, what they’re made of, and how they got to be
          that way.`,
          `But with new instruments on Earth and in space, we’ve begun to
          glimpse how much we still don’t know about the cosmos.`
        ],
        cites: ["Dinge zu bewegen macht einfach Spaß"]
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
