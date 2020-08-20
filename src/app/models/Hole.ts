
/**
 * A hole on a golf course
 */
export class Hole {

  constructor(
    public id: number,
    public par: number,
    public no: number,
    public teeBlockHoles : TeeBlockHole[]
  ) {}

}

/**
 * Tee blocks that can be played at the hole, adds distance for that tee block and can be used to override default hole par
 */
export class TeeBlockHole {

  constructor(
    public id: number,
    public teeBlockId: number,
    public holeId: number,
    public distance: number,
    public color: string,
    public par: number, // this par is an override value, could be null
    public no: number

  ) {}

}
