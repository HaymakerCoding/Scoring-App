import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material';
import { QuotablesComponent } from '../quotables/quotables.component';
import { BasicReg } from '../models/BasicReg';

/**
 * Bottom Nav section offers some user options meant to be generic to all scoring routines
 * 
 * @author Malcolm Roy
 */
@Component({
  selector: 'app-bottom-nav',
  templateUrl: './bottom-nav.component.html',
  styleUrls: ['./bottom-nav.component.scss']
})
export class BottomNavComponent implements OnInit, OnDestroy {

  @Input() registered: BasicReg[];
  @Input() showSubmit: boolean;
  @Input() eventId: number;
  subscriptions: Subscription[] = [];
  bottomSheetRef: MatBottomSheetRef;

  constructor(
    private authService: AuthService,
    private router: Router,
    private bottomSheet: MatBottomSheet
  ) { }

  ngOnInit() {

  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  logout() {
    this.authService.logout();
  }

  showAllScores() {
    this.router.navigate(['/slammer-tour/all-scores/' + this.eventId]);
  }

  goToEnterScores() {
    this.router.navigate(['/slammer-tour/scoring/' + this.eventId]);
  }

  showQuotables() {
      this.bottomSheetRef = this.bottomSheet.open(QuotablesComponent, { data: {registered: this.registered, eventId: this.eventId } });
  }

}
