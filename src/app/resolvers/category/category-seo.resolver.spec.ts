import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { categorySeoResolver } from './category-seo.resolver';

describe('categorySeoResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => categorySeoResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
