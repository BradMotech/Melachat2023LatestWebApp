import { TestBed } from '@angular/core/testing';

import { FireStoreCollectionsServiceService } from './fire-store-collections-service.service';

describe('FireStoreCollectionsServiceService', () => {
  let service: FireStoreCollectionsServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FireStoreCollectionsServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
