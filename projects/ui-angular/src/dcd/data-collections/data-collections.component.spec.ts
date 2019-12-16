import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataCollectionsComponent } from './data-collections.component';

describe('DataCollectionsComponent', () => {
  let component: DataCollectionsComponent;
  let fixture: ComponentFixture<DataCollectionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataCollectionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataCollectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
