
import { GroupParticipant } from './GroupParticipant';
import { Team } from './Team';

/**
 * A group of golfer playing in a league or tournament event.
 * up to 4 players
 * @author Malcolm Roy
 */
export class Group {

  constructor(
      public id: number,
      public eventId: number,
      public teeTime: any,
      public startHole: number,
      public groupParticipants: GroupParticipant[]
  ) {}

}


