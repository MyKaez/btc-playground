import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import manifest from "../../../package.json";

[Injectable]
export class AppContextService {
    get appVersion(): string {
        return manifest.version; 
    }

    get buildEnvironment(): string {
        return environment.environmentName;
    }

    setup() {
        console.log(`%c Loaded FixesTh.is at version ${this.appVersion} in environment ${this.buildEnvironment}`, "background: linear-gradient(45deg, #0b0b0d, #0c1326); padding: .5rem 1rem");
    }
}