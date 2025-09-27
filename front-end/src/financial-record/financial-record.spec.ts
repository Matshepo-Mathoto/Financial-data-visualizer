import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialRecord } from './financial-record';

describe('FinancialRecord', () => {
  let component: FinancialRecord;
  let fixture: ComponentFixture<FinancialRecord>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinancialRecord]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinancialRecord);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
