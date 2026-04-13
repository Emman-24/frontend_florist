import {Routes} from '@angular/router';
import {environment} from '../environments/environment';
import {seoResolver} from './resolvers/seo/seo.resolver';
import {categorySeoResolver, subCategorySeoResolver} from './resolvers/category/category-seo.resolver';
import {productSeoResolver} from './resolvers/product/product-seo.resolver';

const BASE = environment.baseUrl
export const routes: Routes = [

  // ────────────────────────────────────────
  // HOME  →  /
  // ─────────────────────────────────────────
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
    resolve: {seo: seoResolver},
    data: {
      seo: () => ({
        title: 'Inicio',
        description: 'Floristería Akasia - Arreglos florales en Pereira. Entrega a domicilio en Pereira y Dosquebradas.',
        keywords: 'floristería, flores, Pereira, Dosquebradas, arreglos florales, ramos, entrega a domicilio',
        url: BASE,
        type: 'website'
      })
    }
  },

  // ─────────────────────────────────────────
  // PRODUCT CATALOG  →  /productos
  // ─────────────────────────────────────────
  {
    path: 'productos',
    children: [

      // All products  →  /productos
      {
        path: '',
        loadComponent: () =>  import('./pages/product-list/product-list.component').then(m => m.ProductListComponent),
        resolve: {seo: seoResolver},
        data: {
          seo: () => ({
            title: 'Productos - Arreglos Florales',
            description:
              'Descubre nuestra amplia variedad de arreglos florales, ramos y flores para toda ocasión. Entrega a domicilio en Pereira y Dosquebradas.',
            keywords:
              'catálogo, flores, arreglos florales, Pereira, Dosquebradas, floristería',
            url: `${BASE}/productos`,
            type: 'website',
          })
        }
      },

      // Product detail  →  /productos/ramo-primaveral-grande
      {
        path: ':route',
        loadComponent: () =>import('./pages/product-detail/product-detail.component').then(m => m.ProductDetailComponent),
        resolve: {seo: productSeoResolver},
      }
    ]
  },
  // ─────────────────────────────────────────
  // CATEGORIES  →  /categorias
  // ─────────────────────────────────────────
  {
    path: 'categorias',
    children: [

      {
        // Category  →  /categorias/rosas
        path: ':categoryRoute',
        children: [
          {
            path: '',
            loadComponent: () =>import('./pages/product-list/product-list.component').then(m => m.ProductListComponent),
            resolve: {seo: categorySeoResolver},
          },

          {
            // Subcategory →  /categorias/rosas/rosas-rojas
            path: ':subCategoryRoute',
            loadComponent: () =>import('./pages/product-list/product-list.component').then(m => m.ProductListComponent),
            resolve: {seo: subCategorySeoResolver},
          }

        ]
      }
    ]
  },
  {
    path: '**',
    loadComponent:()=> import('./pages/not-found/not-found.component').then(m => m.NotFoundComponent),
    resolve: {seo: seoResolver},
    data: {
      seo: () => ({
        title: 'Página no encontrada - 404',
        description: 'La página que buscas no existe. Visita nuestra tienda de flores en Pereira para ver nuestros productos.',
        keywords: 'error 404, página no encontrada',
        url: BASE,
        type: 'website'
      })
    }
  }


];
