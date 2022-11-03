import { Injectable } from "@angular/core";
import { ContactDescription } from "./types";

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
            images: [
                { srcFile: "assets/img/personal/danny.png", displayDuration: 4500 },
                { srcFile: "assets/img/personal/danny_laser.jpg", displayDuration: 500 }
            ],
            quote: "Bitcoin, there is no second best.",
            paragraphs: [
                `Aktuell mine ich Fiat als Elektrotechnik-Ingenieur.
                Außerhalb der „normalen Arbeit“ startete ich im Jahr 2021 einen Podcast  „Orange Relationship“ - der Name soll hierbei auf die täglichen Gedanken und Erkenntnisse verweisen, welche ich rundum Bitcoin haben darf. Ein paar Monate später (Ende 2021) aktivierte ich meinen gleichnamige YouTube-Kanal, dieser dient bis heute als Plattform wöchentlichen Bitcoin-Contents. Im Rahmen des YouTube-Projektes programmierte ich die ersten Simulationen und erklärte diese in meinen Videos, was eine hohe Nachfrage und ein paar Iterationen weiter FixesTh.is als Resultat hatte.`
            ],
            cites: [
                `Kurs gesagt: I'm just another Pleb.`
            ],
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
            images: [
                { srcFile: "assets/img/personal/kenny.jpg", displayDuration: 4500 },
                { srcFile: "assets/img/personal/kenny_laser.jpg", displayDuration: 500 }
            ],
            quote: "Lieber Satoshis inner Wallet als Euros auf'm Konto.",
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
            images: [
                { srcFile: "assets/img/personal/sarah.png" }
            ],
            quote: "Do your own proof of work.",
            paragraphs: [
                `Ich arbeite momentan in einem Start up als Product Owner eines digitalen Produktes in einer eher konservativen Branche. Als Product Owner habe ich insbesondere meine Vorliebe für das UI/UX Design entdeckt, weil ich der festen Überzeugung bin, dass ein gutes User Interface und eine gute User Experience maßgeblich für den „Produkterfolg" verantwortlich sind. Ich habe bisher auch schon zahlreiche Erfahrungen im Marketing, Service und Vertrieb sammeln können. Zu Hause bin ich allerdings in der agilen Softwareentwicklung. :)`,
                `Mit meinen Erfahrungen versuche ich in diesem Projekt so gut wie es geht zu unterstützen, lungere aber noch am Rande des Kaninchenbaus herum. Mal schauen, wann ich reinfalle. :)`
            ],
            cites: [],
            socialMedia: [
                {
                    type: "twitter",
                    url: "https://twitter.com/SarahRaymond__"
                }
            ]
        }
    }

    private getNico(): ContactDescription {
        return {
            name: "Nico",
            description: "Nico D., geb. 1991",
            images: [
                { srcFile: "assets/img/personal/missing.png" }
            ],
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
