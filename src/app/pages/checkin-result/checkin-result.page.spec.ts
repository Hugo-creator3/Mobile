import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CheckinResultPage } from './checkin-result.page';

describe('CheckinResultPage', () => {
  let component: CheckinResultPage;
  let fixture: ComponentFixture<CheckinResultPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckinResultPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
