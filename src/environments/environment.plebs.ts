import { FormulaComponent, XpaComponent } from "src/app/simulations";

export const environment = {
  production: true,
  beta: true,
  presentationMode: false,
  environmentName: "plebs",
  simulations: [XpaComponent.title],
  debugImages: false,
  apiUrl: "https://api.btcis.me"
};

export class Config {
  static readonly VOLTAGE_KEY: string = "api-key";
  static readonly BTC_PAY_AUTH: string = "basic auth";
  static readonly FIRE_REQUEST: boolean = false;
}
