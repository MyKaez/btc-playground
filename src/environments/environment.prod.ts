import { FormulaComponent, XpaComponent } from "src/app/simulations";

export const environment = {
  production: true,
  presentationMode: true,
  environmentName: "prod",
  simulations: [FormulaComponent.title, XpaComponent.title],
  debugImages: false
};

export class Config {
  static readonly VOLTAGE_KEY: string = "api-key";
  static readonly BTC_PAY_AUTH: string = "basic auth";
  static readonly FIRE_REQUEST: boolean = false;
}
