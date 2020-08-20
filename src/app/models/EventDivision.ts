

/**
 * Represent a Division played in an event
 * @author Malcolm Roy
 */
export class EventDivision {

  constructor(
      public id: number,
      public competitionId: number,
      public divisionId: number,
      public eventId: number,
      public name: string

  ) {}

}

