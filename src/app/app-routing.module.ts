import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { InfoComponent } from './info/info.component';
import { AboutComponent, AboutTheTeamComponent, SupportUsComponent } from './pages';
import { BlocksizeComponent } from './simulations/blocksize/blocksize.component';
import { PowComponent } from './simulations/pow/pow.component';
import { RingOfFireComponent } from './simulations/rof/ring-of-fire.component';
import { SimulationsComponent } from './simulations/simulations.component';
import { XpaComponent } from './simulations/xpa/xpa.component';

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
  { path: 'about', component: AboutComponent },
  { path: 'team', component: AboutTheTeamComponent },
  { path: 'support', component: SupportUsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
