import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyOneDimensionComponent } from './property-one-dimension.component';

describe('PropertyOneDimensionComponent', () => {
  let component: PropertyOneDimensionComponent;
  let fixture: ComponentFixture<PropertyOneDimensionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PropertyOneDimensionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyOneDimensionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
