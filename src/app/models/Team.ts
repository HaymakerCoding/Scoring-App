
import { HoleScore } from './HoleScore';
import { Individual } from './Individual';
import { EventParticipant } from './EventParticipant';
import { Hole } from './Hole';

/**
 * A team participant in a golf event
 * @author Malcolm Roy
 */
export class Team extends EventParticipant  {

  
  constructor(
      public teamId: number,
      public teamParticipantId: number,
      public groupParticipantId: number,
      public teamMembers: Individual[],
      public holeScores: HoleScore[],
      public score: number,
      public scoreId: number
  ) {
    super(
      holeScores, score, scoreId
    );
  }

}



