import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BasicReg } from '../models/BasicReg';
import { Subscription } from 'rxjs';
import { QuoteService } from '../services/quote.service';
import { AuthService } from '../services/auth.service';
import { AllQuotes } from '../models/AllQuotes';

/**
 * Displayed in a Bottom Sheet
 * Handle updating the database with user entered 'Quotables' and 'Notables'.
 * These are text data relevant to the event.
 * Any User in a group can add these with the app
 * 
 * @author Malcolm Roy
 */
@Component({
  selector: 'app-quotables',
  templateUrl: './quotables.component.html',
  styleUrls: ['./quotables.component.scss']
})
export class QuotablesComponent implements OnInit, OnDestroy {

  registered: BasicReg[];
  subscriptions: Subscription[] = [];
  eventId: number;
  userNames: UserNames;
  userId: number;
  loading: boolean;
  allQuotes: AllQuotes;
  
  constructor(
     @Inject(MAT_BOTTOM_SHEET_DATA) private data: any,
     @Inject(MatBottomSheetRef) private sheetRef: MatBottomSheetRef,
     private quoteService: QuoteService,
     private snackbar: MatSnackBar,
     private authService: AuthService
  ) {}

  ngOnInit() {
    this.loading = true;
    this.registered = this.data.registered;
    this.eventId = this.data.eventId;
    this.getUserNames();
  }

  /**
   * Attempt to get the username from memory, or hitup the database for it if needed.
   * We need the nickname of the user here to attempt to match them to a registered user for the purposes of defaulting the quotable/notable player to the user logged in
   */
  getUserNames() {
    this.userNames = this.authService.getUserNames();
    if (!this.userNames) {
      this.authService.getUserNamesFromDb().subscribe(response => {
        if (response.status === 200) {
          this.userNames = response.payload;
          this.setUserId();
        } else {
          console.error(response);
        }
      });
    } else {
      this.setUserId();
    }
  }

  /**
   * Attempt to find the user by their nickname, not the best but this is not too important, just to default the selector to user
   * If we can match their nicknames then set the user id here
   */
  setUserId() {
    const user: BasicReg = this.registered.find(x => x.nickname === this.userNames.nickname);
    this.userId = user ? user.slammerId : null;
    this.loading = false;
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  close() {
    this.sheetRef.dismiss();
  }

  /**
   * Add a new quotable/notable to the database
   * @param playerId Player ID same as Slammer ID here
   * @param text User entered text
   * @param type Type dictates the type of quote for the db record, 1 = quotable, 2 = notable
   */
  saveQuotable(playerId: number, text: string, type: string) {
    let quoteType: number;
    let msg: string;
    if (type === Type.QUOTABLE) {
      quoteType = 1;
      msg = 'Quotable Saved!';
    } else if (type === Type.NOTABLE) {
      quoteType = 2;
      msg = 'Notable Saved!';
    }
    const nickname = this.registered.find(x => +x.slammerId === +playerId).nickname;
    this.subscriptions.push(this.quoteService.add(this.eventId, playerId, quoteType, text, nickname).subscribe(response => {
      if (response.status === 201) {
        this.snackbar.open(msg, '', { duration: 1100 });
        this.close();
      } else {
        console.error(response);
      }
    }));
  }

}

enum Type{
  QUOTABLE = 'quotable',
  NOTABLE = 'notable'
}

interface UserNames {
  fullName: string,
  nickname: string
}
