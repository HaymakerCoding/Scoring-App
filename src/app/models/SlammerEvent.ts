
/**
 * Event data for the slammer toure, including
 * @author Malcolm Roy
 */
export class SlammerEvent {

  constructor(
      public id: number,
      public name: string,
      public fullName: string,
      public courseId: number,
      public date: any,
      public time: any,
      public groupNumbers: number[]
  ) {}

}
