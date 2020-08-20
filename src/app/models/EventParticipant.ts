import { HoleScore } from './HoleScore';

/**
 * A participant in an event
 * @author Malcolm Roy
 */
export abstract class EventParticipant {

  constructor(
    public holeScores: HoleScore[],
    public score: number,
    public scoreId: number
  ) {
    
  }

}



