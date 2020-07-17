import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminScoringComponent } from './admin-scoring.component';

describe('AdminScoringComponent', () => {
  let component: AdminScoringComponent;
  let fixture: ComponentFixture<AdminScoringComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminScoringComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminScoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
