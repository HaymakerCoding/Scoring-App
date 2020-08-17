import { HoleScore } from './HoleScore';

/**
 * A participant in a group of golf
 * @author Malcolm Roy
 */
export class GroupParticipant {

  constructor(
      public id: number,
      public participantId: number,
      public groupId: number,
      public scoreId: number,
      public memberId: number,
      public fullName: string,
      public divisions: any,
      public holeScores: HoleScore[],
      public teeBlock1id: number,
      public score: number,
      public totalScore: number, // all rounds combined as total
  ) {}

}



