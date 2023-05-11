// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { PowComponent, XpaComponent } from "src/app/simulations";

export const environment = {
    production: true,
    presentationMode: false,
    beta: true,
    environmentName: "dev",
    simulations: undefined,
    debugImages: false,
    apiUrl: "https://api.btcis.me"
};

export class Config {
    static readonly VOLTAGE_KEY: string = "api-key";
    static readonly BTC_PAY_AUTH: string = "basic auth";
    static readonly FIRE_REQUEST: boolean = false;
}

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
  // import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
