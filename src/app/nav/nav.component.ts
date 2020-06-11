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
  deferredPrompt: any;

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.showUserMenu = false;
    this.stashInstall()
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

  /**
   * Stash prompt to install PWA.
   * This is triggered by browser and not all browsers support.
   * IF this is stashed we can offer user a button and then give them the prompt allowing 'install' of this app
   * Currently this is not supported on iOS so will not work on iPhone of in safari, other browsers on PC and android phones should be fine
   */
  stashInstall() {
    if (window.matchMedia('(display-mode: browser)').matches) {
      window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        this.deferredPrompt = e;
      });
    }
  }

  onUserInstall(){
    this.deferredPrompt.prompt();
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
  getNames(): void {
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
