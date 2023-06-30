import { FormulaComponent, XpaComponent } from "src/app/simulations";

export const environment = {
  production: true,
  beta: true,
  presentationMode: false,
  simulations: [XpaComponent.title],
  environmentName: "prod",
  debugImages: false,
  useHttpsRouting: true
};

export class Config {
  static readonly VOLTAGE_KEY: string = "api-key";
  static readonly BTC_PAY_AUTH: string = "basic auth";
  static readonly FIRE_REQUEST: boolean = false;
}
