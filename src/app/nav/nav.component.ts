import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit, OnDestroy {

  loggedIn: boolean;
  userNickname: string;
  userFullName: string;
  subscriptions: Subscription[] = [];
  showUserMenu: boolean;

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.showUserMenu = false;
    this.trackLoggedIn();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  /**
   * Track login changes to reflect them in header
   */
  trackLoggedIn() {
    this.subscriptions.push(this.authService.getLoggedIn().subscribe((response: boolean) => {
      this.loggedIn = response;
      if (response === true && !this.userNickname) {
        this.getNames();
      }
    }));
  }

  toggleUserMenu() {
    this.showUserMenu = !this.showUserMenu;
  }

  logout() {
    this.authService.logout();
  }

  /**
   * Get the user's full name AND nickname either from memory or database
   */
  getNames() {
    const userNames = this.authService.getUserNames();
    if (userNames) {
      this.userNickname = userNames.nickname;
      this.userFullName = userNames.fullName;
    } else {
      this.subscriptions.push(this.authService.getUserNamesFromDb().subscribe(response => {
        if (response.status === 200) {
          this.userNickname = response.payload.nickname;
          this.userFullName = response.payload.fullName;
        } else {
          console.error(response);
        }
      }));
    }
  }


}
