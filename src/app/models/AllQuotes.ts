
/**
 * Represent all the quotables, notables and feedback bundled up for an event.
 * @author Malcolm Roy
 */
export class AllQuotes {

  constructor(
      public notables: Notable[],
      public quotables: Quotable[],
      public feedbacks: Feedback[],
  ) {}

}

interface Quotable {
  id: number;
  eventId: number;
  playerId: number;
  Slammer: string;
  Quote: string;
  typeOfQuote: any;
}

interface Notable {
  id: number;
  eventId: number;
  playerId: number;
  Slammer: string;
  Quote: string;
  typeOfQuote: any;
}

interface Feedback {
  id: number;
  eventId: number;
  playerId: number;
  Slammer: string;
  Quote: string;
  typeOfQuote: any;
}

