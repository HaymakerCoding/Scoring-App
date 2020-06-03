import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotablesComponent } from './quotables.component';

describe('QuotablesComponent', () => {
  let component: QuotablesComponent;
  let fixture: ComponentFixture<QuotablesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuotablesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuotablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
