import {Component, inject, OnInit, OnDestroy, signal} from '@angular/core';
import {NgForOf, NgIf, CurrencyPipe} from '@angular/common';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';
import {switchMap, map} from 'rxjs/operators';
import {ProductService} from '../../services/product/product.service';
import {ProductImage, ProductDetail} from '../../models/product';

interface TagMetadata {
  emoji: string;
  desc: string;
}

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    CurrencyPipe
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

  tagMetadata: { [key: string]: TagMetadata } = {
    'rosas': {
      emoji: '🌹',
      desc: 'Arreglo floral'
    },
    'girasoles': {
      emoji: '🌻',
      desc: 'Arreglo floral'
    },
    'gerberas': {
      emoji: '🏵️',
      desc: 'Arreglo floral'
    },
    'heliconias': {
      emoji: '🌿',
      desc: 'Arreglo floral'
    },
    'vino': {
      emoji: '🍷',
      desc: 'Licores y brindis'
    },
    'chocolates': {
      emoji: '🍫',
      desc: 'Dulces y confitería'
    },
    'peluche': {
      emoji: '🧸',
      desc: 'Detalles y regalos'
    },
    'frutas': {
      emoji: '🍇',
      desc: 'Canastas frutales'
    },
    'lirios': {
      emoji: '🌺',
      desc: 'Arreglo floral'
    },
    'globos': {
      emoji: '🎈',
      desc: 'Detalles y regalos'
    }
  };


  ngOnInit(): void {
    this.sub = this.route.paramMap.pipe(
      map(params => String(params.get('route'))),
      switchMap(id => {
        this.loading = true;
        this.error = false;
        this.selectedThumb.set(0);
        return this.productService.getProductBySlug(id);
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

  getEmojiForTag(route: string): TagMetadata {
    return this.tagMetadata[route] || {emoji: '✨', desc: 'Detalle especial'};
  }

  switchThumb(i: number): void {
    this.selectedThumb.set(i);
  }
}
