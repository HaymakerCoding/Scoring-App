import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './login/login.component';

import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatPaginatorModule} from '@angular/material/paginator';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatRadioModule} from '@angular/material/radio';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatTabsModule} from '@angular/material/tabs';
import { MatDialogModule } from '@angular/material/dialog';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NavComponent } from './nav/nav.component';
import { SlammerPickDateComponent } from './slammer-pick-date/slammer-pick-date.component';
import { SlammerScoringComponent } from './slammer-scoring/slammer-scoring.component';
import { EnterScoresComponent } from './enter-scores/enter-scores.component';
import { BottomNavComponent } from './bottom-nav/bottom-nav.component';
import { AllScoresComponent } from './all-scores/all-scores.component';
import { QuotablesComponent } from './quotables/quotables.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { MainComponent } from './main/main.component';
import { HoleByHoleComponent } from './hole-by-hole/hole-by-hole.component';
import { SummaryComponent } from './summary/summary.component';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { AdminScoringComponent } from './admin-scoring/admin-scoring.component';
import { ErrorPageComponent } from './error-page/error-page.component';
import { LogoutComponent } from './logout/logout.component';
import { ErrorInterceptor } from './error.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NavComponent,
    SlammerPickDateComponent,
    SlammerScoringComponent,
    EnterScoresComponent,
    BottomNavComponent,
    AllScoresComponent,
    QuotablesComponent,
    MainComponent,
    HoleByHoleComponent,
    SummaryComponent,
    LeaderboardComponent,
    AdminScoringComponent,
    ErrorPageComponent,
    LogoutComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatPaginatorModule,
    MatMomentDateModule,
    MatDatepickerModule,
    MatProgressSpinnerModule,
    MatSidenavModule,
    MatCheckboxModule,
    MatRadioModule,
    MatSnackBarModule,
    MatTabsModule,
    MatDialogModule,
    MatProgressBarModule,
    MatButtonModule, MatIconModule, MatInputModule, MatSelectModule, MatSliderModule, MatToolbarModule, MatButtonToggleModule,
  MatCardModule, MatSlideToggleModule, MatListModule, MatTableModule, MatExpansionModule, MatBottomSheetModule, ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  entryComponents: [QuotablesComponent],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
