import {Component, inject, OnInit, OnDestroy, signal} from '@angular/core';
import {NgForOf, NgIf, CurrencyPipe} from '@angular/common';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {Subscription} from 'rxjs';
import {switchMap, map} from 'rxjs/operators';
import {ProductService} from '../../services/product/product.service';
import {ProductImage, ProductDetail} from '../../models/product';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    CurrencyPipe,
    RouterLink
  ],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.sass'
})
export class ProductDetailComponent implements OnInit, OnDestroy {

  product: ProductDetail | null = null;
  loading = true;
  error = false;

  selectedThumb = signal(0);
  activeTab = signal<'description' | 'care' | 'delivery'>('description');

  private readonly route = inject(ActivatedRoute);
  private readonly productService = inject(ProductService);
  private sub!: Subscription;

  ngOnInit(): void {
    this.sub = this.route.paramMap.pipe(
      map(params =>String(params.get('route'))),
      switchMap(id => {
        this.loading = true;
        this.error = false;
        this.selectedThumb.set(0);
        return this.productService.getProductBySeoName(id);
      })
    ).subscribe({
      next: response => {
        this.product = response.data;
        this.loading = false;
      },
      error: () => {
        this.error = true;
        this.loading = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  get mainImage(): ProductImage | null {
    if (!this.product || this.product.gallery.length === 0) return null;
    return this.product.gallery[this.selectedThumb()] ?? this.product.gallery[0];
  }

  get primaryCategory(): string {
    if (!this.product || this.product.categories.length === 0) return '';
    return this.product.categories[0].name;
  }

  get formattedPrice(): number {
    if (!this.product) return 0;
    return this.product.price.hasDiscount && this.product.price.discountAmount != null
      ? this.product.price.discountAmount
      : this.product.price.amount;
  }

  switchThumb(i: number): void {
    this.selectedThumb.set(i);
  }
}
