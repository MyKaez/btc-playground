import { Injectable } from "@angular/core";

@Injectable()
export class TeamService {
    getContactDescriptions(): ContactDescription[] {
        return [
            this.getDanny(),
            this.getKenny(),
            this.getSarah(),
            this.getNico()
        ];
    }

    private getDanny(): ContactDescription {
        return {
            name: "Danny",
            description: "geb. 1989",
            imageSrc: "assets/img/personal/danny.png",
            quote: "Bitcoin, there is no second best.",
            paragraphs: [
                `Aktuell mint er Fiat als Elektrotechnik-Ingenieur.
                Außerhalb der „normalen Arbeit“ startete er im Jahr 2021 einen Podcast  „Orange Relationship“ - der Name soll hierbei auf die täglichen Gedanken verweisen, welche er rundum Bitcoin hat.`,
                "Ein paar Monate später (Ende 2021) wurde der gleichnamige YouTube-Kanal aktiviert und dient bis heute als Plattform wöchentlichen Bitcoin-Contents. Im Rahmen des YouTube-Projektes programmierte Danny die ersten Simulationen und erklärte diese in seinen Videos, was eine hohe Nachfrage und ein paar Iterationen weiter FixesTh.is als Resultat hatte."
            ],
            cites: [],
            socialMedia: [
                {
                    type: "twitter",
                    url: "https://twitter.com/OrangeRelation"
                },
                {
                    type: "youtube",
                    url: "https://www.youtube.com/@OrangeRelationship"
                },
                {
                    type: "github",
                    url: "https://github.com/DannyOrangeRelationship"
                }
            ]
        }
    }

    private getKenny(): ContactDescription {
        return {
            name: "Kenny",
            description: "Kenneth N., geb. 13.09.1990",
            imageSrc: "assets/img/personal/kenny.jpg",
            imageLaserSrc: "assets/img/personal/kenny_laser.jpg",
            quote: "Lieber Satoshis in der Wallet als Euros auf dem Konto.",
            paragraphs: [
                "Ich folge derzeit meiner Passion, dem Programmieren. Primär im Backend Bereich tätig, entwickle ich Software für den Finanz Bereich - über Landesgrenzen hinweg wird diese Software von allen möglichen Unternehmen in verschiedensten Ländern verwendet. Seit 2011 arbeite ich somit in den tiefsten Tiefen des Fiat systems.",
                "Dezember 2021, als der Kurs bei knapp $70k Stand, habe ich mir dann meine Finger verbrannt - an Bitcoin. Daraufhin wollte ich verstehen, was Bitcoin ist und wieso es so viel Faszination um das Thema gibt."
            ],
            cites: [
                "Nun habe ich, dank Bitcoin, auch meine thematische Passion gefunden."
            ],
            socialMedia: [
                {
                    type: "twitter",
                    url: "https://twitter.com/bitty_kn"
                },
                {
                    type: "github",
                    url: "https://github.com/MyKaez"
                }
            ]
        }
    }

    private getSarah(): ContactDescription {
        return {
            name: "Sarah",
            description: "Sarah K., geb. 1995",
            imageSrc: "assets/img/personal/sarah.png",
            quote: "Do your own proof of work.",
            paragraphs: [
                `Sie arbeitet momentan in einem Start up als Product Owner eines digitalen Produktes in einer eher konservativen Branche. Als Product Owner hat sie ihre Vorliebe für das UI/UX Design entdeckt, da sie der Überzeugung ist, dass ein gutes User Interface und eine gute User Experience maßgeblich für den Produkterfolg verantwortlich ist.`,
                `Im Rahmen Ihres Werdegangs hat sie ebenfalls zahlreiche Erfahrungen im Marketing, Service und im Vertrieb aufbauen können. Zu Hause ist sie allerdings momentan in der agilen Softwareentwicklung.`
            ],
            cites: []
        }
    }

    private getNico(): ContactDescription {
        return {
            name: "Nico",
            description: "Nico D., geb. 1991",
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
            cites: ["Dinge zu bewegen macht einfach Spaß"],
            socialMedia: [
                {
                    type: "twitter",
                    url: "https://twitter.com/Pandabytez"
                },
                {
                    type: "github",
                    url: "https://github.com/Pandabyts"
                }
            ]
        }
    }
}

export interface ContactDescription {
    name: string;
    description: string;
    imageSrc: string;
    imageLaserSrc?: string;
    quote: string;
    cites: string[];
    paragraphs: string[];
    socialMedia?: SocialMediaInfo[]
}

export interface SocialMediaInfo {
    type: "twitter" | "github" | "youtube";
    url: string;
}
