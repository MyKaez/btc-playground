import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { CarouselModule } from '@coreui/angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PowComponent } from './simulations';
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
import {
  SimulationService,
  SimulationContainerComponent,
  BlockSizeService, PowService,
  SimulationCardComponent,
  BlocksizeComponent,
  XpaComponent,
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
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NodeModelComponent } from 'src/prototypes/node-model/node-model.component';
import { SocialBarComponent } from './meta';
import { LanguageSelectorComponent, ThemeEditorComponent } from './shared/personal';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { ColorPickerModule } from 'ngx-color-picker';
import { YouTubePlayerModule } from '@angular/youtube-player';
import { ImageCarouselComponent } from './shared/media';
import { NotificationService } from './shared/media/notification.service';
import { TeamService } from './pages/about-the-team/team.service';
import { BtcService } from './shared/helpers/btc.service';
import { BtcPayService } from './shared/helpers/btc-pay.service';
import { DonationComponent } from './shared/donation/donation.component';
import { ConditionalImageComponent } from './shared/media/conditional-image/conditional-image.component';
import { PowDefinitionComponent } from './simulations/pow/definition/pow-definition.component';
import { XpaDefinitionComponent } from './simulations/xpa/definition/definition.component';
import { FormulaComponent } from './simulations/formula/formula.component';
import { AppContextService } from './core';
import { SessionsComponent } from './pages/sessions/feature/main/sessions.component';
import { InputSessionComponent } from './pages/sessions/ui/input-session/input-session.component';
import { SessionListComponent } from './pages/sessions/ui/session-list/session-list.component';
import { SessionInfoComponent } from './pages/sessions/ui/session-info/session-info.component';
import { UserComponent } from './pages/sessions/feature/user/user.component';
import { HashListComponent } from './pages/sessions/ui/hash-list/hash-list.component';


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
    LogoComponent,
    RingOfFireComponent,
    MainNavComponent,
    FooterComponent,
    XpaComponent,
    InfoComponent,
    SocialBarComponent,
    LanguageSelectorComponent,
    ThemeEditorComponent,
    AboutComponent,
    AboutTheTeamComponent,
    SupportUsComponent,
    BlocksizeComponent,
    DonationComponent,
    ConditionalImageComponent,
    PowDefinitionComponent,
    XpaDefinitionComponent,
    SimulationContainerComponent,
    FormulaComponent,
    SessionsComponent,
    InputSessionComponent,
    SessionListComponent,
    SessionInfoComponent,
    UserComponent,
    HashListComponent
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
    MatSnackBarModule,
    CarouselModule
  ],
  providers: [
    AppContextService,
    LayoutService,
    BtcService,
    BtcPayService,
    BlockSizeService,
    PowService,
    SimulationService,
    NotificationService,
    TeamService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(appContext: AppContextService) {
    appContext.setup();
  }
}
