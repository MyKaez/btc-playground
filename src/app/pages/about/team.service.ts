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
            imageSrc: "assets/team/danny.png",
            quote: "Bitcoin, there is no second best.",
            paragraphs: [
                "Aktuell mint er Fiat als Elektrotechnik-Ingenieur.",
                "Außerhalb der „normalen Arbeit“ startete er im Jahr 2021 einen Podcast  „Orange Relationship“ - der Name soll hierbei auf die täglichen Gedanken verweisen, welche er rundum Bitcoin hat. Ein paar Monate später (Ende 2021) wurde der gleichnamige YouTube-Kanal aktiviert und dient bis heute als Plattform wöchentlichen Bitcoin-Contents. Im Rahmen des YouTube-Projektes programmierte Danny die ersten Simulationen und erklärte diese in seinen Videos, was eine hohe Nachfrage und ein paar Iterationen weiter FixesTh.is als Resultat hatte."
            ],
            cites: []
        }
    }

    private getKenny(): ContactDescription {
        return {
            name: "Kenny",
            description: "Kenneth N., geb. 13.09.1990",
            imageSrc: "assets/team/kenny.jpg",
            quote: "Bitcoin, there is no second best.",
            paragraphs: [
                "Ich folge derzeit meiner Passion, dem Programmieren. Primär im Backend Bereich tätig, entwickle ich Software für den Finanz Bereich - über Landesgrenzen hinweg wird diese Software von allen möglichen Unternehmen in verschiedensten Ländern verwendet. Seit 2011 arbeite ich somit in den tiefsten Tiefen des Fiat systems.",
                "Dezember 2021, als der Kurs bei knapp $70k Stand, habe ich mir dann meine Finger verbrannt - an Bitcoin. Daraufhin wollte ich verstehen, was Bitcoin ist und wieso es so viel Faszination um das Thema gibt.",
                "Nun schreibe ich zusätzlich Software für Bitcoin. Hoffentlich eines Tages ebenfalls über Landesgrenzen hinweg."
            ],
            cites: [
                "Nun habe ich, dank Bitcoin, auch meine thematische Passion gefunden."
            ]
        }
    }

    private getSarah(): ContactDescription {
        return {
            name: "Sarah",
            description: "Sarah K., geb. 1995",
            imageSrc: "assets/team/sarah.png",
            quote: "Do your own proof of work.",
            paragraphs: [
                "Sie arbeitet momentan in einem Start up als Product Owner eines digitalen Produktes in einer eher konservativen Branche. Als Product Owner hat sie ihre Vorliebe für das UI/UX Design entdeckt, da sie der Überzeugung ist, dass ein gutes User Interface und eine gute User Experience maßgeblich für den Produkterfolg verantwortlich ist. Im Rahmen Ihres Werdegangs hat sie ebenfalls zahlreiche Erfahrungen im Marketing, Service und im Vertrieb aufbauen können. Zu Hause ist sie allerdings momentan in der agilen Softwareentwicklung."
            ],
            cites: []
        }
    }

    private getNico(): ContactDescription {
        return {
            name: "Nico",
            description: "Nico D., geb. 1990",
            imageSrc: "",
            quote: "",
            paragraphs: [
            ],
            cites: []
        }
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
