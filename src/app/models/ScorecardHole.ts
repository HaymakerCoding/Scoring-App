
/**
 * A Hole on a scorecard
 */
export class ScorecardHole {

  constructor(
    public id: number,
    public holeId: number,
    public hole: number,
    public scorecardId: number,
    public teeBlockId: number,
    public color: string,
    public distance: number,
    public par: number,
    public eventId: number
  ) {}

}

