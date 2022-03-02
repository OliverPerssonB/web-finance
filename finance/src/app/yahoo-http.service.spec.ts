import { TestBed } from '@angular/core/testing';

import { YahooHttpService } from './yahoo-http.service';

describe('YahooHttpService', () => {
  let service: YahooHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(YahooHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
