import {inject, Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {map, Observable, shareReplay} from 'rxjs';
import {CategoryApiResponse, CategoryNode} from '../../models/category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private readonly http = inject(HttpClient);

  private readonly categories$: Observable<CategoryNode[]> =
    this.http
      .get<CategoryApiResponse>(`${environment.apiUrl}/categories/tree`)
      .pipe(
        map(res => res.data),
        shareReplay(1)
      );

  getCategories(): Observable<CategoryNode[]> {
    return this.categories$;
  }
}


