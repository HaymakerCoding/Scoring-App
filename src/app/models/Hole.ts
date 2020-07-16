
/**
 * A hole on a golf course
 */
export class Hole {

  constructor(
    public id: number,
    public par: number,
    public no: number,
    public teeBlocks : TeeBlock[]
  ) {}

}

/**
 * Tee blocks that can be played at the hole, adds distance for that tee block and can be used to override default hole par
 */
export class TeeBlock {

  constructor(
    public id: number,
    public teeBlockHoleId: number,
    public color: string,
    public distance: number,
    public par: number // this par is an override value, could be null

  ) {}

}