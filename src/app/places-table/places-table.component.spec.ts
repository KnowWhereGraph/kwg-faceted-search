import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlacesTableComponent } from './places-table.component';

describe('PlacesTableComponent', () => {
  let component: PlacesTableComponent;
  let fixture: ComponentFixture<PlacesTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlacesTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlacesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
