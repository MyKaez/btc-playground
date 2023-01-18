import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {
  HomeComponent,
  AboutComponent,
  InfoComponent,
  SupportUsComponent,
  AboutTheTeamComponent,
  SimulationsComponent
} from './pages';

import {
  BlocksizeComponent,
  XpaComponent,
  RingOfFireComponent,
  PowComponent
} from './simulations';
import { FormulaComponent } from './simulations/formula/formula.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'info', component: InfoComponent },
  { path: 'simulations', component: SimulationsComponent },
  { path: 'simulations/pow', component: PowComponent },
  { path: 'simulations/pow/:tab', component: PowComponent },
  { path: 'simulations/xpa', component: XpaComponent },
  { path: 'simulations/rof', component: RingOfFireComponent },
  { path: 'simulations/blocksize', component: BlocksizeComponent },
  { path: 'simulations/formula', component: FormulaComponent },
  { path: 'about', component: AboutComponent },
  { path: 'team', component: AboutTheTeamComponent },
  { path: 'support', component: SupportUsComponent },
  { path: '**', redirectTo: '/home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
