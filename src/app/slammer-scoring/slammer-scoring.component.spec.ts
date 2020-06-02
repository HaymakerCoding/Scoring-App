import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SlammerScoringComponent } from './slammer-scoring.component';

describe('SlammerScoringComponent', () => {
  let component: SlammerScoringComponent;
  let fixture: ComponentFixture<SlammerScoringComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SlammerScoringComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SlammerScoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
