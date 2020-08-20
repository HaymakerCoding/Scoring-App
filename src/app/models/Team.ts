import { HoleScore } from './HoleScore';
import { GroupParticipant } from './GroupParticipant';

/**
 * A team participant in a group of golf
 * @author Malcolm Roy
 */
export class Team {

  constructor(
      public teamId: number,
      public holeScores: HoleScore[],
      public teamMembers: GroupParticipant[], // all rounds combined as total
  ) {}

}



