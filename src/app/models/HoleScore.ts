
/**
 * A Players score on a golf course hole
 */
export class HoleScore {

  constructor(
    public id: number,
    public scoreId: number,
    public teeBlockId: number,
    public hole: number,
    public score: number
  ) {}

}

