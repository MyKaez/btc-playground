import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';

@Injectable()
export class SimulationService {
    readonly onStartSimulation = new Observable<boolean>();

    getSimulations(): Simulation[] {
        return [{
            title: "Blocksize",
            description: "Wie entwickelt sich die Blockchain Größe?",
            imageSrc: "assets/Miner_seite2.png",
            youtubeSrc: "Act1XIKj1w0",
            navigationLink: "simulations/blocksize"
        }, {
            title: "Proof of Work",
            description: "Fixes this... Determinismus / Vorhersehbarkeit",
            imageSrc: "assets/Miner_seite2.png",
            youtubeSrc: "MRNSudh565Y",
            navigationLink: "simulations/pow"
        }, {
            title: "51% Attacke",
            description: "Stellen wir uns vor, China kauft das Internet...",
            imageSrc: "assets/Miner_seite2.png",
            youtubeSrc: "-adMIa1jV80",
            navigationLink: "simulations/xpa"
        }, {
            title: "Ring Of Fire",
            description: "Wie funktioniert denn Lightning?",
            imageSrc: "assets/Miner_seite2.png",
            youtubeSrc: "88PSUCvErPA",
            navigationLink: "simulations/rof"
        }, {
            title: "Die Bitcoin Formel",
            description: "Wie funktioniert Bitcoin?",
            imageSrc: "assets/Miner_seite2.png",
            youtubeSrc: "",
            navigationLink: "simulations/formula"
        }];
    }
}

export interface Simulation {
    title: string;
    description: string;
    imageSrc: string;
    youtubeSrc: string;
    navigationLink: string;
}