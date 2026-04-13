import {Component, inject, OnInit, OnDestroy, signal} from '@angular/core';
import {NgForOf, NgIf, CurrencyPipe} from '@angular/common';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {switchMap, tap, combineLatest, map, BehaviorSubject, Subject, takeUntil} from 'rxjs';
import {ProductService} from '../../services/product/product.service';
import {CategoryService} from '../../services/category/category.service';
import {Product} from '../../models/product';
import {CategoryNode, Category} from '../../models/category';
import {PaginationComponent} from '../../components/pagination/pagination.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    CurrencyPipe,
    RouterLink,
    PaginationComponent
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.sass'
})
export class ProductListComponent implements OnInit, OnDestroy {

  products: Product[] = [];
  totalElements = 0;
  totalPages = 0;
  loading = signal(false);
  currentPage = signal(0);
  readonly pageSize = 12;
  readonly skeletonItems = Array(this.pageSize).fill(null);

  activeCategory: Category | null = null;
  activeSubCategory: Category | null = null;
  subCategories: Category[] = [];

  private readonly route = inject(ActivatedRoute);
  private readonly productService = inject(ProductService);
  private readonly categoryService = inject(CategoryService);

  private readonly pageChange$ = new BehaviorSubject<number>(0);
  private readonly destroy$ = new Subject<void>();

  ngOnInit(): void {
    const allParams$ = combineLatest(
      this.collectParamMaps(this.route)
    ).pipe(
      map(paramsList => {
        const merged: Record<string, string> = {};
        for (const p of paramsList) {
          for (const key of p.keys) {
            merged[key] = p.get(key)!;
          }
        }
        return merged;
      })
    );

    combineLatest([allParams$, this.categoryService.getCategories()])
      .pipe(
        tap(([params, tree]) => {
          const categorySlug = params['categoryRoute'];
          const subCategorySlug = params['subCategoryRoute'];

          this.activeCategory = null;
          this.activeSubCategory = null;
          this.subCategories = [];

          if (categorySlug) {
            const parentNode = this.findNodeBySlug(tree, categorySlug);
            if (parentNode) {
              this.activeCategory = parentNode.category;
              this.subCategories = parentNode.children.map(c => c.category);

              if (subCategorySlug) {
                const childNode = parentNode.children.find(c => c.category.slug === subCategorySlug);
                if (childNode) this.activeSubCategory = childNode.category;
              }
            }
          }

          this.currentPage.set(0);
        }),

        switchMap(() => {
          this.pageChange$.next(0);
          return this.pageChange$;
        }),

        switchMap(page => {
          const categoryId = this.activeSubCategory?.id ?? this.activeCategory?.id;
          this.loading.set(true);
          return this.productService.getProducts({
            page,
            size: this.pageSize,
            sortBy: 'views',
            sortDir: 'desc',
            ...(categoryId != null ? {categoryId} : {}),
          });
        }),

        takeUntil(this.destroy$),
      )
      .subscribe(response => {
        this.products = response.content;
        this.totalElements = response.totalElements;
        this.totalPages = response.totalPages;
        this.loading.set(false);
        this.scrollToTop();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
    this.pageChange$.next(page);
  }

  get pageTitle(): string {
    if (this.activeSubCategory) return this.activeSubCategory.name;
    if (this.activeCategory) return this.activeCategory.name;
    return 'Flores';
  }

  get pageEyebrow(): string {
    return this.activeCategory?.name ?? 'Nuestra Colección';
  }

  subCategoryLink(sub: Category): string[] {
    return this.activeCategory
      ? ['/categorias', this.activeCategory.slug, sub.slug]
      : [];
  }

  isActiveSubCategory(sub: Category): boolean {
    return this.activeSubCategory?.id === sub.id;
  }

  isAllActive(): boolean {
    return this.activeCategory != null && this.activeSubCategory == null;
  }

  private scrollToTop(): void {
    if (typeof window !== 'undefined') {
      window.scrollTo({top: 0, behavior: 'smooth'});
    }
  }


  private collectParamMaps(route: ActivatedRoute) {
    const maps = [];
    let current: ActivatedRoute | null = route;
    while (current) {
      maps.push(current.paramMap);
      current = current.parent;
    }
    return maps;
  }

  private findNodeBySlug(tree: CategoryNode[], slug: string): CategoryNode | null {
    for (const node of tree) {
      if (node.category.slug === slug) {
        return node;
      }
      const found = this.findNodeBySlug(node.children, slug);
      if (found) return found;
    }
    return null;
  }

}
