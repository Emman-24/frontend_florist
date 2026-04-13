import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {Meta, Title} from '@angular/platform-browser';
import {DOCUMENT, isPlatformBrowser} from '@angular/common';
import {environment} from '../../../environments/environment';


export interface PageMetadata {
  title: string;
  description: string;
  image?: string;
  url?: string;
  keywords?: string;
  type?: string;
}

@Injectable({
  providedIn: 'root'
})
export class MetaService {

  private readonly baseUrl = `${environment.baseUrl}`;
  private readonly defaultImage = `${environment.baseUrl}/assets/images/og-default.jpg`;
  private readonly siteName = 'Floristería Akasia';
  private readonly isBrowser: boolean;

  constructor(
    private meta: Meta,
    private title: Title,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  updateMetaTags(metadata: PageMetadata): void {
    const {
      title,
      description,
      image = this.defaultImage,
      url = this.baseUrl,
      keywords,
      type = 'website'
    } = metadata;

    this.title.setTitle(`${title} | ${this.siteName}`);

    this.meta.updateTag({name: 'description', content: description});
    if (keywords) {
      this.meta.updateTag({name: 'keywords', content: keywords});
    }

    this.meta.updateTag({property: 'og:title', content: title});
    this.meta.updateTag({property: 'og:description', content: description});
    this.meta.updateTag({property: 'og:image', content: image});
    this.meta.updateTag({property: 'og:url', content: url});
    this.meta.updateTag({property: 'og:type', content: type});
    this.meta.updateTag({property: 'og:site_name', content: this.siteName});

    this.meta.updateTag({name: 'twitter:card', content: 'summary_large_image'});
    this.meta.updateTag({name: 'twitter:title', content: title});
    this.meta.updateTag({name: 'twitter:description', content: description});
    this.meta.updateTag({name: 'twitter:image', content: image});

    this.updateCanonicalUrl(url);
  }

  updateProductMeta(product: {
    title: string,
    description: string,
    price: string,
    image: string,
    route: string,
    category: string
  }): void {
    const url = `${this.baseUrl}/productos/${product.route}`;

    this.updateMetaTags({
      title: product.title,
      description: product.description || `${product.title} - Desde $${product.price} COP. Entrega a domicilio en Pereira.`,
      image: product.image,
      url: url,
      keywords: `${product.title}, ${product.category}, flores Pereira, floristería`,
      type: 'product'
    });

    this.meta.updateTag({property: 'product:price:amount', content: product.price});
    this.meta.updateTag({property: 'product:price:currency', content: 'COP'});
    this.meta.updateTag({property: 'product:availability', content: 'in stock'});
  }


  setDefaultMeta(): void {
    this.updateMetaTags({
      title: 'Inicio',
      description: 'Floristería Akasia - Arreglos florales en Pereira. Entrega a domicilio en Pereira y Dosquebradas.',
      keywords: 'floristería, flores, Pereira, arreglos florales, ramos, entrega a domicilio',
      url: this.baseUrl
    });
  }

  private updateCanonicalUrl(url: string): void {
    if (!this.isBrowser) {
      return;
    }

    let link: HTMLLinkElement | null = this.document.querySelector('link[rel="canonical"]');

    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }

  addStructuredData(data: any): void {
    if (!this.isBrowser) {
      return;
    }
    const existingScript = this.document.getElementById('structured-data');
    if (existingScript) {
      existingScript.remove();
    }
    const script = this.document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'structured-data';
    script.text = this.escapeJson(data);
    document.head.appendChild(script);
  }

  addProductStructuredData(product: {
    title: string;
    description: string;
    price: string;
    image: string;
    route: string;
    rating?: number;
    reviewCount?: number;
  }): void {
    const structuredData = {
      '@context': 'https://schema.org/',
      '@type': 'Product',
      name: product.title,
      image: product.image,
      description: product.description,
      brand: {
        '@type': 'Brand',
        name: 'Floristería Akasia'
      },
      offers: {
        '@type': 'Offer',
        url: `${this.baseUrl}/productos/${product.route}`,
        priceCurrency: 'COP',
        price: product.price,
        availability: 'https://schema.org/InStock',
        seller: {
          '@type': 'Organization',
          name: 'Floristería Akasia'
        }
      }
    };

    if (product.rating && product.reviewCount && product.reviewCount > 0) {
      (structuredData as any).aggregateRating = {
        '@type': 'AggregateRating',
        ratingValue: product.rating.toString(),
        reviewCount: product.reviewCount.toString()
      };
    }

    this.addStructuredData(structuredData);
  }

  addOrganizationStructuredData(): void {
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'Florist',
      name: 'Floristería Akasia',
      image: this.defaultImage,
      '@id': this.baseUrl,
      url: this.baseUrl,
      telephone: '+57-320-686-1244',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Cl. 26 #6-05',
        addressLocality: 'Pereira',
        addressRegion: 'Risaralda',
        postalCode: '660001',
        addressCountry: 'CO'
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 4.816159484427112,
        longitude: -75.6999265625941
      },
      sameAs: [
        'https://www.facebook.com/floristeriaakasia',
        'https://www.instagram.com/floristeriaakasia'
      ]
    };

    this.addStructuredData(structuredData);
  }

  private escapeJson(data: any): string {
    return JSON.stringify(data).replace(/<\/script>/gi, '<\\/script>');
  }
}
