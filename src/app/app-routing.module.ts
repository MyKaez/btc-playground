import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PowComponent } from './simulations/pow/pow.component';
import { SimulationsComponent } from './simulations/simulations.component';
import { XpaComponent } from './simulations/xpa/xpa.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'simulations', component: SimulationsComponent },
  { path: 'simulations/pow', component: PowComponent },
  { path: 'simulations/xpa', component: XpaComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
