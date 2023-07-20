import { PowComponent, XpaComponent } from "src/app/simulations";

export const environment = {
  production: true,
  beta: true,
  presentationMode: false,
  environmentName: "plebs",
  simulations: [XpaComponent.title, PowComponent.title],
  debugImages: false,
  btcApi: 'https://api.btcis.me',
  //btcApi: 'https://localhost:5001',
};

export class Config {
  static readonly VOLTAGE_KEY: string = "api-key";
  static readonly BTC_PAY_AUTH: string = "basic auth";
  static readonly FIRE_REQUEST: boolean = false;
}
