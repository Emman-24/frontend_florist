import {Component, inject, OnInit, OnDestroy} from '@angular/core';
import {NgForOf, NgIf, CurrencyPipe} from '@angular/common';
import {RouterLink} from '@angular/router';
import {Subscription} from 'rxjs';
import {ProductService} from '../../services/product/product.service';
import {Product} from '../../models/product';

@Component({
  selector: 'app-featured',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    CurrencyPipe,
    RouterLink
  ],
  templateUrl: './featured.component.html',
  styleUrl: './featured.component.sass'
})
export class FeaturedComponent implements OnInit, OnDestroy {

  products: Product[] = [];
  private sub!: Subscription;
  private readonly productService = inject(ProductService);

  ngOnInit(): void {
    this.sub = this.productService.getProducts({
      page: 0,
      size: 5,
      featured: true,
      sortBy: 'views',
      sortDir: 'desc'
    }).subscribe(response => {
      this.products = response.content;
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  get firstProduct(): Product | null {
    return this.products.length > 0 ? this.products[0] : null;
  }

  get restProducts(): Product[] {
    return this.products.slice(1);
  }

  productPrice(product: Product): number {
    return product.price.hasDiscount && product.price.discountAmount != null
      ? product.price.discountAmount
      : product.price.amount;
  }

  primaryCategory(product: Product): string {
    return product.categories.length > 0 ? product.categories[0].name : '';
  }
}
