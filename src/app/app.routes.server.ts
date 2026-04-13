import {RenderMode, ServerRoute} from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'productos',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'productos/:route',
    renderMode: RenderMode.Server,
  },
  {
    path: 'categorias/:categoryRoute',
    renderMode: RenderMode.Server,
  },
  {
    path: 'categorias/:categoryRoute/:subCategoryRoute',
    renderMode: RenderMode.Server,
  },
  {
    path: '**',
    renderMode: RenderMode.Server,
  },
];
