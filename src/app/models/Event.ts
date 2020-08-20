import { GroupParticipant } from './GroupParticipant';
import { Scorecard } from './Scorecard';
import { Group } from './Group';
import { EventDivision } from './EventDivision';

/**
 * An event. belongs to a season which belongs to an event type
 * @author Malcolm Roy
 */
export class Event {

  constructor(
      public id: number,
      public seasonId: number,
      public courseId: number,
      public courseName: string,
      public name: string,
      public eventDate: any,
      public eventTime: any,
      public qualifyingRound: QualifyingRound,
      public scorecardId: number,
      public groups: Group[],
      public divisionParticipants: GroupParticipant[],
      public scorecard: Scorecard,
      public divisionList: EventDivision[],
      public classification: Classification

  ) {}

}

export enum Classification {
  MAIN = 'main',
  QUALIFIER = 'qualifier',
  EXHIBITION = 'exhibition'
}

enum QualifyingRound {
  ROUND1 = 'Round 1',
  ROUND2 = 'Round 2',
  ROUND3 = 'Round 3',
  ROUND4 = 'Round 4',
  ROUND5 = 'Round 5',
  SEMIFINAL = 'Semi-Final',
  FINAL = 'Final'
}
