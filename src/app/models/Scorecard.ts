
import { ScorecardHole } from './ScorecardHole';
import { Hole } from './Hole';

/**
 * A Scorecard for a golf course
 * A scorecard must have 1 section of holes (1-9) but more commonly has 2 section of holes (1-9) and (10-18).
 * name is just a way to refer to the card and is a combination of the section names
 * 
 * @author Malcolm Roy
 */
export class Scorecard {

  constructor(
    public id: number,
    public courseId: number,
    public section1id: number,
    public section2id: number,
    public name: string,
    public section1: CourseSection,
    public section2: CourseSection,
    public scorecardHoles: ScorecardHole[]
  ) {}

}

export interface CourseSection {
  name: SectionName,
  sectionId: number,
  courseId: number,
  holes: Hole[],
}

enum SectionName {
  FRONT = 'Front',
  BACK = 'Back',
  NORTH = 'North',
  SOUTH = 'South', 
  EAST = 'East',
  WEST = 'West',
  OTHER = 'Other',
  CENTRAL = 'Central'
}

