import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { CarouselModule } from '@coreui/angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PowComponent } from './simulations/pow/pow.component';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatSliderModule } from '@angular/material/slider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { VidComponent } from './shared/vid/vid.component';
import { BlockSizeService, PowService,
  SimulationCardComponent,
  BlocksizeComponent,
  PowSimulationComponent,
  PowCalculatorComponent,
  XpaComponent,
  XpaSimulationComponent,
  RingOfFireComponent 
} from './simulations';

import {   
  HomeComponent,
  AboutComponent, 
  LayoutService, 
  SupportUsComponent,
  AboutTheTeamComponent,
  SimulationsComponent, 
  InfoComponent
} from './pages';

import { LogoComponent, MainNavComponent, FooterComponent } from './page-layout';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { NodeModelComponent } from 'src/prototypes/node-model/node-model.component';
import { SocialBarComponent } from './meta';
import { LanguageSelectorComponent, ThemeEditorComponent } from './shared/personal';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { ColorPickerModule } from 'ngx-color-picker';
import { YouTubePlayerModule } from '@angular/youtube-player';
import { ImageCarouselComponent } from './shared/media';


@NgModule({
  declarations: [
    AppComponent,    
    NodeModelComponent,
    ImageCarouselComponent,
    PowComponent,
    VidComponent,
    HomeComponent,
    SimulationCardComponent,
    SimulationsComponent,
    PowSimulationComponent,
    PowCalculatorComponent,
    LogoComponent,
    RingOfFireComponent,
    MainNavComponent,
    FooterComponent,
    XpaComponent,
    XpaSimulationComponent,
    InfoComponent,
    SocialBarComponent,
    LanguageSelectorComponent,
    ThemeEditorComponent,
    AboutComponent,
    AboutTheTeamComponent,
    SupportUsComponent,
    BlocksizeComponent    
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatTableModule,
    MatTabsModule,
    MatCheckboxModule,
    MatButtonModule,
    MatInputModule,
    MatSliderModule,
    MatSelectModule,
    MatCardModule,
    MatProgressBarModule,
    MatExpansionModule,
    MatSlideToggleModule,
    YouTubePlayerModule,
    ColorPickerModule,
    LayoutModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    CarouselModule
  ],
  providers: [
    LayoutService,
    BlockSizeService,
    PowService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
