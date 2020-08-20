
import { HoleScore } from './HoleScore';
import { EventParticipant } from './EventParticipant';

/**
 * A individual participant in a group of golf
 * @author Malcolm Roy
 */
export class Individual extends EventParticipant {

  constructor(
    public participantId: number, 
    public individualId: number,
    public fullName: string,
    public memberId: number,
    public competitionId: number,
    public division: string,
    public holeScores: HoleScore[],
    public score: number,
    public scoreId: number
    
  ) {
    super(holeScores, score, scoreId);
  }

}



