import { Injectable } from "@angular/core";
import { Observable, Subscriber } from 'rxjs';

@Injectable()
export class SimulationService {
    private startSimulationSubscriber: Subscriber<boolean> | undefined;
    readonly listeningToStartSimulation = new Observable<boolean>(subscriber => this.startSimulationSubscriber = subscriber );
    updateStartSimulation(isStarted: boolean) {
        if(!this.startSimulationSubscriber) return;
        this.startSimulationSubscriber.next(isStarted);
    }

    getSimulations(): Simulation[] {
        return [{
            title: "Blocksize",
            description: "Wie entwickelt sich die Blockchain Größe?",
            youtubeSrc: "Act1XIKj1w0",
            navigationLink: "simulations/blocksize"
        }, {
            title: "Proof of Work",
            description: "Fixes this... Determinismus / Vorhersehbarkeit",
            youtubeSrc: "MRNSudh565Y",
            navigationLink: "simulations/pow"
        }, {
            title: "51% Attacke",
            description: "Stellen wir uns vor, China kauft das Internet...",
            youtubeSrc: "-adMIa1jV80",
            navigationLink: "simulations/xpa"
        }, {
            title: "Ring Of Fire",
            description: "Wie funktioniert denn Lightning?",
            youtubeSrc: "88PSUCvErPA",
            navigationLink: "simulations/rof"
        }, {
            title: "Die Bitcoin Formel",
            description: "Wie funktioniert Bitcoin?",
            imageSrc: "assets/img/fixed-above.png",
            navigationLink: "simulations/formula"
        }];
    }
}

export interface Simulation {
    title: string;
    description: string;
    imageSrc?: string;
    youtubeSrc?: string;
    navigationLink?: string;
}