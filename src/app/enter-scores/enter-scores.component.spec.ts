import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnterScoresComponent } from './enter-scores.component';

describe('EnterScoresComponent', () => {
  let component: EnterScoresComponent;
  let fixture: ComponentFixture<EnterScoresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnterScoresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnterScoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
