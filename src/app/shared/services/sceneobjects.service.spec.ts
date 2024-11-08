import { TestBed } from '@angular/core/testing';

import { SceneobjectsService } from './sceneobjects.service';

describe('SceneobjectsService', () => {
  let service: SceneobjectsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SceneobjectsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
