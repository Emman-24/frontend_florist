import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {ProductDetailResponse, ProductPageResponse, ProductSearchParams} from '../../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private readonly http = inject(HttpClient);

  getProducts(params: ProductSearchParams = {}): Observable<ProductPageResponse> {
    let httpParams = new HttpParams();

    if (params.page != null) httpParams = httpParams.set('page', params.page.toString());
    if (params.size != null) httpParams = httpParams.set('size', params.size.toString());
    if (params.sortBy != null) httpParams = httpParams.set('sortBy', params.sortBy);
    if (params.sortDir != null) httpParams = httpParams.set('sortDir', params.sortDir);
    if (params.categoryId != null) httpParams = httpParams.set('categoryId', params.categoryId.toString());
    if (params.tagId != null) httpParams = httpParams.set('tagId', params.tagId.toString());
    if (params.featured != null) httpParams = httpParams.set('featured', params.featured.toString());
    if (params.seasonal != null) httpParams = httpParams.set('seasonal', params.seasonal.toString());
    if (params.available != null) httpParams = httpParams.set('available', params.available.toString());
    if (params.minPrice != null) httpParams = httpParams.set('minPrice', params.minPrice.toString());
    if (params.maxPrice != null) httpParams = httpParams.set('maxPrice', params.maxPrice.toString());

    return this.http.get<ProductPageResponse>(`${environment.apiUrl}/floral-arrangement`, { params: httpParams });
  }

  getProductBySeoName(seoname:string): Observable<ProductDetailResponse> {
    return this.http.get<ProductDetailResponse>(`${environment.apiUrl}/floral-arrangement/seo-name/${seoname}`);
  }
}
