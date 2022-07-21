import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PowComponent } from './simulators/pow/pow.component';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatExpansionModule } from '@angular/material/expansion';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { VidComponent } from './simulators/vid/vid.component';
import { HomeComponent } from './home/home.component';
import { SimpleViewComponent } from './simple-view/simple-view.component';

@NgModule({
  declarations: [
    AppComponent,
    PowComponent,
    VidComponent,
    HomeComponent,
    SimpleViewComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    MatTableModule,
    MatTabsModule,
    MatCheckboxModule,
    MatButtonModule,
    MatInputModule,
    MatCardModule,
    MatProgressBarModule,
    MatExpansionModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
