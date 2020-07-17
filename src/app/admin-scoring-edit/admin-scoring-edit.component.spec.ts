import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminScoringEditComponent } from './admin-scoring-edit.component';

describe('AdminScoringEditComponent', () => {
  let component: AdminScoringEditComponent;
  let fixture: ComponentFixture<AdminScoringEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminScoringEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminScoringEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
