/**
 * Represent a season for an event type
 * @author Malcolm Roy
 */
export class Season {

  constructor(
    public id: number,
    public eventTypeId: number,
    public fromDate: any,
    public toDate: any,
    public year: number
  ){}

}


