import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { productSeoResolver } from './product-seo.resolver';

describe('productSeoResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => productSeoResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
