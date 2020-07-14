import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HoleByHoleComponent } from './hole-by-hole.component';

describe('HoleByHoleComponent', () => {
  let component: HoleByHoleComponent;
  let fixture: ComponentFixture<HoleByHoleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HoleByHoleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HoleByHoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
