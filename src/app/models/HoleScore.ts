
/**
 * A Players score on a golf course hole
 */
export class HoleScore {

  constructor(
    public id: number,
    public scoreId: number,
    public teeBlockHoleId: number,
    public hole: number,
    public score: number,
    public official: boolean,
    public persisted: boolean
  ) {}

}

