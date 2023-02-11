import { PowComponent } from "src/app/simulations";

export const environment = {
  production: true,
  presentationMode: true,
  environmentName: "prod",
  simulations: [PowComponent.title]
};

export class Config {
  static readonly VOLTAGE_KEY: string = "api-key";
  static readonly BTC_PAY_AUTH: string = "basic auth";
  static readonly FIRE_REQUEST: boolean = false;
}
