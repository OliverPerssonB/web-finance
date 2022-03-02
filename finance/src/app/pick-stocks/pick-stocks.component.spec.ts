import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PickStocksComponent } from './pick-stocks.component';

describe('PickStocksComponent', () => {
  let component: PickStocksComponent;
  let fixture: ComponentFixture<PickStocksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PickStocksComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PickStocksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
