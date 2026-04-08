import {ResolveFn} from '@angular/router';
import {ProductService} from '../../services/product/product.service';
import {MetaService} from '../../services/meta/meta.service';
import {inject} from '@angular/core';
import {catchError, EMPTY, map, take} from 'rxjs';
import {environment} from '../../../environments/environment';

const BASE = environment.baseUrl;

export const productSeoResolver: ResolveFn<void> = (route) => {
  const productService = inject(ProductService);
  const metaService    = inject(MetaService);

  const seoName = route.paramMap.get('route') ?? '';

  return productService.getProductBySeoName(seoName).pipe(
    take(1),
    map(({ data: product }) => {
      const price = product.price.hasDiscount && product.price.discountAmount != null
        ? product.price.discountAmount
        : product.price.amount;

      const categoryName = product.categories[0]?.name ?? 'flores';

      const primaryImage = product.gallery.find(img => img.isPrimary)
        ?? product.gallery[0]
        ?? null;

      const description =
        product.description.shortDescription?.trim()
        || `${product.name} — desde $${price.toLocaleString('es-CO')} COP. Entrega a domicilio en Pereira y Dosquebradas.`;

      const keywords = [
        product.name,
        categoryName,
        ...product.tags.map(t => t.text),
        'flores Pereira',
        'arreglos florales',
        'floristería Akasia',
        'entrega a domicilio Pereira',
      ].filter(Boolean).join(', ');

      metaService.updateProductMeta({
        title:       product.name,
        description,
        price:       String(price),
        image:       primaryImage?.originalUrl ?? '',
        route:       product.seoName,
        category:    categoryName,
      });

      // Canonical + structured data
      metaService.addProductStructuredData({
        title:       product.name,
        description,
        price:       String(price),
        image:       primaryImage?.originalUrl ?? '',
        route:       product.seoName,
      });

      // Override keywords (updateProductMeta doesn't expose them)
      // We patch via updateMetaTags keeping all other tags intact.
      metaService.updateMetaTags({
        title:       product.name,
        description,
        keywords,
        image:       primaryImage?.originalUrl,
        url:         `${BASE}/productos/${product.seoName}`,
        type:        'product',
      });
    }),
    catchError(() => {
      // Fallback: generic meta so the route still activates cleanly
      metaService.updateMetaTags({
        title:       'Arreglo Floral — Floristería Akasia',
        description: 'Arreglos florales con entrega a domicilio en Pereira y Dosquebradas. Floristería Akasia.',
        keywords:    'flores, arreglos florales, Pereira, floristería Akasia',
        url:         `${BASE}/productos/${seoName}`,
        type:        'product',
      });
      return EMPTY;
    })
  );
};
