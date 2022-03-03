import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HazardsTableComponent } from './hazards-table.component';

describe('HazardsTableComponent', () => {
  let component: HazardsTableComponent;
  let fixture: ComponentFixture<HazardsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HazardsTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HazardsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
