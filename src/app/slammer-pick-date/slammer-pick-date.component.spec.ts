import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SlammerPickDateComponent } from './slammer-pick-date.component';

describe('SlammerPickDateComponent', () => {
  let component: SlammerPickDateComponent;
  let fixture: ComponentFixture<SlammerPickDateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SlammerPickDateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SlammerPickDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
