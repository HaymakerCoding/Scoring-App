import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from './services/auth-guard.service';
import { LoginComponent } from './login/login.component';
import { SlammerPickDateComponent } from './slammer-pick-date/slammer-pick-date.component';
import { SlammerScoringComponent } from './slammer-scoring/slammer-scoring.component';
import { AllScoresComponent } from './all-scores/all-scores.component';
import { MainComponent } from './main/main.component';
import { AdminScoringComponent } from './admin-scoring/admin-scoring.component';
import { ErrorPageComponent } from './error-page/error-page.component';

const routes: Routes = [
  { path: 'home', component: SlammerPickDateComponent, canActivate: [AuthGuardService] },
  { path: 'login', component: LoginComponent },
  { path: 'scoring/:eventTypeId/:eventId', component: MainComponent,  canActivate: [AuthGuardService]},
  { path: 'admin/:eventTypeId/:eventId', component: AdminScoringComponent, canActivate: [AuthGuardService] },

  { path: 'slammer-tour/pick-date', component: SlammerPickDateComponent , canActivate: [AuthGuardService]},
  { path: 'slammer-tour/scoring/:id', component: SlammerScoringComponent, canActivate: [AuthGuardService]},
  { path: 'slammer-tour/all-scores/:id', component: AllScoresComponent, canActivate: [AuthGuardService]},

  { path: 'error', component: ErrorPageComponent },
  { path: '**', pathMatch: 'full', redirectTo: 'home'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
