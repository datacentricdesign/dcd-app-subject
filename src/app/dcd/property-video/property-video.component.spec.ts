import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyVideoComponent } from './property-video.component';

describe('PropertyVideoComponent', () => {
  let component: PropertyVideoComponent;
  let fixture: ComponentFixture<PropertyVideoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PropertyVideoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
