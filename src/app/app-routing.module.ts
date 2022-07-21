import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SimpleViewComponent } from './simple-view/simple-view.component';
import { PowComponent } from './simulators/pow/pow.component';
import { PowComponent as SimplePowComponent } from './simple-view/pow/pow.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'simple-home', component: SimpleViewComponent },
  { path: 'pow', component: PowComponent },
  { path: 'simple-pow', component: SimplePowComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
