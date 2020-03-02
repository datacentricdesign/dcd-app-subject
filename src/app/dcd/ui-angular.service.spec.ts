import { TestBed } from '@angular/core/testing';

import { UiAngularService } from './ui-angular.service';

describe('UiAngularService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UiAngularService = TestBed.get(UiAngularService);
    expect(service).toBeTruthy();
  });
});
