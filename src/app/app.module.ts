import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';

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
import { MatButtonModule, MatIconModule, MatInputModule, MatSelectModule, MatSliderModule, MatToolbarModule,
MatCardModule, MatSlideToggleModule, MatListModule, MatTableModule, MatExpansionModule, MatBottomSheetModule } from '@angular/material';
import { NavComponent } from './nav/nav.component';
import { SlammerPickDateComponent } from './slammer-pick-date/slammer-pick-date.component';
import { SlammerScoringComponent } from './slammer-scoring/slammer-scoring.component';
import { EnterScoresComponent } from './enter-scores/enter-scores.component';
import { BottomNavComponent } from './bottom-nav/bottom-nav.component';
import { AllScoresComponent } from './all-scores/all-scores.component';
import { QuotablesComponent } from './quotables/quotables.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    NavComponent,
    SlammerPickDateComponent,
    SlammerScoringComponent,
    EnterScoresComponent,
    BottomNavComponent,
    AllScoresComponent,
    QuotablesComponent
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
    MatButtonModule, MatIconModule, MatInputModule, MatSelectModule, MatSliderModule, MatToolbarModule,
  MatCardModule, MatSlideToggleModule, MatListModule, MatTableModule, MatExpansionModule, MatBottomSheetModule
  ],
  entryComponents: [QuotablesComponent],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
