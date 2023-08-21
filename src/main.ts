import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

const providers = [
  {
    provide: 'BTCIS.ME-API',
    useFactory: () => environment.btcApi
  }
]

platformBrowserDynamic(providers).bootstrapModule(AppModule)
  .catch(err => console.log(err));
