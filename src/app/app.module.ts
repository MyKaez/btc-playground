import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
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
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { VidComponent } from './shared/vid/vid.component';
import { HomeComponent } from './home/home.component';
import { SimulationsComponent } from './simulations/simulations.component';
import { SimulationComponent as PowSimulationComponent } from './simulations/pow/simulation/simulation.component';
import { CalculatorComponent as PowCalculatorComponent } from './simulations/pow/calculator/calculator.component';
import { LogoComponent, MainNavComponent, FooterComponent } from './page-layout';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { XpaComponent } from './simulations/xpa/xpa.component';
import { SimulationComponent as XpaSimulationComponent } from './simulations/xpa/simulation/simulation.component';
import { InfoComponent } from './info/info.component';
import { SocialBarComponent } from './meta';
import { LanguageSelectorComponent, ThemeEditorComponent } from './shared/personal';
import { MatSelectModule } from '@angular/material/select';
import { AboutComponent, SupportUsComponent } from './pages';
import { MatDialogModule } from '@angular/material/dialog';
import { MAT_COLOR_FORMATS, NgxMatColorPickerModule, NGX_MAT_COLOR_FORMATS } 
  from '@angular-material-components/color-picker';

@NgModule({
  declarations: [
    AppComponent,
    PowComponent,
    VidComponent,
    HomeComponent,
    SimulationsComponent,
    PowSimulationComponent,
    PowCalculatorComponent,
    LogoComponent,
    MainNavComponent,
    FooterComponent,
    XpaComponent,
    XpaSimulationComponent,
    InfoComponent,
    SocialBarComponent,
    LanguageSelectorComponent,
    ThemeEditorComponent,
    AboutComponent,
    SupportUsComponent
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
    MatSelectModule,
    MatCardModule,
    MatProgressBarModule,
    MatExpansionModule,
    MatSlideToggleModule,
    NgxMatColorPickerModule,
    LayoutModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule
  ],
  providers: [
    { provide: MAT_COLOR_FORMATS, useValue: NGX_MAT_COLOR_FORMATS }],
  bootstrap: [AppComponent]
})
export class AppModule { }
