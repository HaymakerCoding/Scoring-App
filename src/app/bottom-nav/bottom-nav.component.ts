import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { GroupScoresService } from '../services/group-scores.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bottom-nav',
  templateUrl: './bottom-nav.component.html',
  styleUrls: ['./bottom-nav.component.scss']
})
export class BottomNavComponent implements OnInit, OnDestroy {

  @Input() showSubmit: boolean;
  @Input() eventId: number;
  subscriptions: Subscription[] = [];

  constructor(
    private authService: AuthService,
    private groupScoreService: GroupScoresService,
    private router: Router
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

}
