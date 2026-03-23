import {ActivatedRouteSnapshot, Routes} from '@angular/router';
import {environment} from '../environments/environment';
import {HomeComponent} from './pages/home/home.component';
import {seoResolver} from './resolvers/seo/seo.resolver';
import {ProductListComponent} from './pages/product-list/product-list.component';
import {ProductDetailComponent} from './pages/product-detail/product-detail.component';
import {NotFoundComponent} from './pages/not-found/not-found.component';

const BASE = environment.baseUrl
export const routes: Routes = [

  // ────────────────────────────────────────
  // HOME  →  /
  // ─────────────────────────────────────────
  {
    path: '',
    loadComponent: () => HomeComponent,
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
        loadComponent: () => ProductListComponent,
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
        loadComponent: () =>ProductDetailComponent,
        resolve: {seo: seoResolver},
        data: {
          seo: (route: ActivatedRouteSnapshot) => ({
            title: `${route.params['route']} - Floristería Akasia`,
            description: `Compra ${route.params['route']} con entrega a domicilio en Pereira y Dosquebradas. Arreglos florales únicos de Floristería Akasia.`,
            keywords: `${route.params['route']}, flores, Pereira, floristería, arreglos florales`,
            url: `${BASE}/productos/${route.params['route']}`,
            type: 'product',
          }),
        },
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
            loadComponent: () =>ProductListComponent,
            resolve: {seo: seoResolver},
            data: {
              seo: (route: ActivatedRouteSnapshot) => ({
                title: `${route.params['categoryRoute']} - Arreglos Florales`,
                description: `Explora nuestra selección de arreglos florales en la categoría ${route.params['categoryRoute']}. Entrega a domicilio en Pereira.`,
                keywords: `${route.params['categoryRoute']}, flores, arreglos florales, Pereira, floristería`,
                url: `${BASE}/categorias/${route.params['categoryRoute']}`,
                type: 'website',
              }),
            },
          },

          {
            // Subcategory →  /categorias/rosas/rosas-rojas
            path: ':subCategoryRoute',
            loadComponent: () =>ProductListComponent,
            resolve: {seo: seoResolver},
            data: {
              seo: (route: ActivatedRouteSnapshot) => ({
                title: `${route.params['subCategoryRoute']} - ${route.params['categoryRoute']} - Floristería Akasia`,
                description: `Explora ${route.params['subCategoryRoute']} dentro de ${route.params['categoryRoute']}. Arreglos florales con entrega a domicilio en Pereira.`,
                keywords: `${route.params['subCategoryRoute']}, ${route.params['categoryRoute']}, flores, Pereira, floristería`,
                url: `${BASE}/categorias/${route.params['categoryRoute']}/${route.params['subCategoryRoute']}`,
                type: 'website',
              }),
            }

          }

        ]
      }
    ]
  },
  {
    path: '**',
    component: NotFoundComponent,
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
