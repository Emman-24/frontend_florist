import {Component, inject, OnInit, OnDestroy} from '@angular/core';
import {NgForOf, NgIf, CurrencyPipe} from '@angular/common';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {Subscription, switchMap, tap, combineLatest, map} from 'rxjs';
import {ProductService} from '../../services/product/product.service';
import {CategoryService} from '../../services/category/category.service';
import {Product} from '../../models/product';
import {CategoryNode, Category} from '../../models/category';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    CurrencyPipe,
    RouterLink
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.sass'
})
export class ProductListComponent implements OnInit, OnDestroy {

  products: Product[] = [];
  totalElements = 0;

  /** The current parent category (from :categoryRoute) */
  activeCategory: Category | null = null;
  /** The current sub-category (from :subCategoryRoute) */
  activeSubCategory: Category | null = null;
  /** Children of the active parent category – used as filter buttons */
  subCategories: Category[] = [];

  private readonly route = inject(ActivatedRoute);
  private readonly productService = inject(ProductService);
  private readonly categoryService = inject(CategoryService);
  private sub!: Subscription;

  ngOnInit(): void {
    // Collect all route params from the full path (own + all ancestors)
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

    this.sub = combineLatest([
      allParams$,
      this.categoryService.getCategories()
    ]).pipe(
      tap(([params, tree]) => {
        const categorySlug: string | undefined = params['categoryRoute'];
        const subCategorySlug: string | undefined = params['subCategoryRoute'];

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
              if (childNode) {
                this.activeSubCategory = childNode.category;
              }
            }
          }
        }
      }),
      switchMap(() => {
        const categoryId = this.activeSubCategory?.id ?? this.activeCategory?.id;
        return this.productService.getProducts({
          page: 0,
          size: 12,
          sortBy: 'views',
          sortDir: 'desc',
          ...(categoryId != null ? {categoryId} : {})
        });
      })
    ).subscribe(response => {
      this.products = response.content;
      this.totalElements = response.totalElements;
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  get pageTitle(): string {
    if (this.activeSubCategory) {
      return this.activeSubCategory.name;
    }
    if (this.activeCategory) {
      return this.activeCategory.name;
    }
    return 'Flores';
  }

  get pageEyebrow(): string {
    if (this.activeCategory) {
      return this.activeCategory.name;
    }
    return 'Nuestra Colección';
  }

  /** Build routerLink for a sub-category filter button */
  subCategoryLink(sub: Category): string[] {
    if (this.activeCategory) {
      return ['/categorias', this.activeCategory.slug, sub.slug];
    }
    return [];
  }

  /** Check if a sub-category is the active one */
  isActiveSubCategory(sub: Category): boolean {
    return this.activeSubCategory?.id === sub.id;
  }

  /** Check if "all" filter is active (no sub-category selected) */
  isAllActive(): boolean {
    return this.activeCategory != null && this.activeSubCategory == null;
  }

  /** Collect paramMap observables from the current route and all ancestors */
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
