import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyTwoDimensionsComponent } from './property-two-dimensions.component';

describe('PropertyTwoDimensionsComponent', () => {
  let component: PropertyTwoDimensionsComponent;
  let fixture: ComponentFixture<PropertyTwoDimensionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PropertyTwoDimensionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyTwoDimensionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
