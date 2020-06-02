
/**
 * Golf Group of up to 4 people
 * @author Malcolm Roy
 */
export class Group {

  constructor(
      public groupNum: number,
      public player1id: number,
      public player1name: string,
      public player1nickname: string,
      public player2id: number,
      public player2name: string,
      public player2nickname: string,
      public player3id: number,
      public player3name: string,
      public player3nickname: string,
      public player4id: number,
      public player4name: string,
      public player4nickname: string,
      public player1scores: Score[],
      public player2scores: Score[],
      public player3scores: Score[],
      public player4scores: Score[]
  ) {}

}

export interface Score {
  hole: number;
  score: number;

}
