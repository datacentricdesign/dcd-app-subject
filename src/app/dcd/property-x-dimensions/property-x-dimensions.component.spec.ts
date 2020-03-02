import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyXDimensionsComponent } from './property-x-dimensions.component';

describe('PropertyXDimensionsComponent', () => {
  let component: PropertyXDimensionsComponent;
  let fixture: ComponentFixture<PropertyXDimensionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PropertyXDimensionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyXDimensionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
