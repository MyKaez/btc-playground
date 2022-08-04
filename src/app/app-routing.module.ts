import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PowComponent } from './simulations/pow/pow.component';
import { PowComponent as SimplePowComponent } from './simple-view/pow/pow.component';
import { SimulationsComponent } from './simulations/simulations.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'simulations', component: SimulationsComponent },
  { path: 'pow', component: PowComponent },
  { path: 'simple-pow', component: SimplePowComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
