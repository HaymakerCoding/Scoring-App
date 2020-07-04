import { NumberSymbol } from '@angular/common';

/**
 * Basic Event Data for a list
 * @author Malcolm Roy
 */
export class EventBasic {

  constructor(
      public id: number,
      public fullName: string,
      public status: string,
      public date: any,
      public tournamentName: string,
      public type: TournamentType,
      public courseName: string,
      public eventTypeId: number,
      public eventDate: any
  ) {}

}

export enum TournamentType {
  TOURNAMENT = 'tournament',
  LEAGUE = 'league',
  TRIP = 'trip'
}
