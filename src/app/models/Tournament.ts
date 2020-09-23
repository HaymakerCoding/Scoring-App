
import { EventDivision } from './EventDivision';

/**
 * Represent a tournament, all data
 * @author Malcolm Roy
 */
export class Tournament {

  constructor(
    public id: number,
    public eventTypeId: number,
    public url: string,
    public name: string,
    public host: string,
    public about: string,
    public featureImage: string,
    public phoneFeature: string,
    public logo: string,
    public presentedByLogo: string,
    public headerImage: string,
    public useLogo: any,
    public usePresentedBy: any,
    public useNameImage: any,
    public navColor: string,
    public buttonColor: string,
    public phoneHeader: string,
    public rules: Rule[],
    public rulesHeader: string,
    public rulesLastUpdated: any,
    public divisions: EventDivision[],
    public header: string,
    public subHeader: string,
    public trophyPic: string,
    public prizingText: string,
    public scoringLink: string,
    public courseDomain: string
  ) {

  }

}

export class Rule {

  constructor(
    public id: number,
    public tournamentId: number,
    public text: string,
    public lastUpdated: any,
    public updatedBy: any
  ) {}
}
