import { Injectable } from "@angular/core";
import { Observable, of, shareReplay, Subscriber } from 'rxjs';
import { environment } from "src/environments/environment";
import { FormulaComponent } from "./formula/formula.component";
import { PowComponent } from "./pow/pow.component";
import { XpaComponent } from "./xpa/xpa.component";

@Injectable()
export class SimulationService {
    private startSimulationSubscriber: Subscriber<boolean> | undefined;
    readonly listeningToStartSimulation = new Observable<boolean>(subscriber => this.startSimulationSubscriber = subscriber);

    updateStartSimulation(isStarted: boolean) {
        if (!this.startSimulationSubscriber) return;
        this.startSimulationSubscriber.next(isStarted);
    }

    getSimulationsStream(): Observable<Simulation[]> {
        return of(this.getSimulations()).pipe(
            shareReplay(1)
        );
    }

    getSimulations(): Simulation[] {
        const simulations = [{
            title: "Blocksize",
            description: "Wie entwickelt sich die Blockchain Größe?",
            youtubeSrc: "Act1XIKj1w0",
            navigationLink: "simulations/blocksize"
        }, {
            title: PowComponent.title,
            description: "Fixes this... Determinismus / Vorhersehbarkeit",
            youtubeSrc: "E2ee5ewEddE",
            imageSrc: "assets/img/simulations/sim-pow-title.jpg",
            navigationLink: "simulations/pow"
        }, {
            title: XpaComponent.title,
            description: "Mit BitCoins zahlen ohne zu zahlen.",
            imageSrc: "assets/img/simulations/sim-xpa-title.jpg",
            youtubeSrc: "-adMIa1jV80",
            navigationLink: "simulations/xpa"
        }, {
            title: "Ring Of Fire",
            description: "Wie funktioniert denn Lightning?",
            youtubeSrc: "88PSUCvErPA",
            navigationLink: "simulations/rof"
        }, {
            title: FormulaComponent.title,
            description: "Wie funktioniert Bitcoin?",
            imageSrc: "assets/img/fixed-above.png",
            youtubeSrc: "iCMwPVv2tLg",
            navigationLink: "simulations/formula"
        }];
        if (!environment.simulations) {
            return simulations;
        }
        const activated = <string[]>environment.simulations;
        return simulations.filter(s => activated.includes(s.title))
    }
}

export interface Simulation {
    title: string;
    description: string;
    imageSrc?: string;
    youtubeSrc?: string;
    navigationLink?: string;
}