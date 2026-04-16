import {ResolveFn} from '@angular/router';
import {inject} from '@angular/core';
import {CategoryService} from '../../services/category/category.service';
import {MetaService, PageMetadata} from '../../services/meta/meta.service';
import {environment} from '../../../environments/environment';
import {CategoryNode} from '../../models/category';
import {map, take} from 'rxjs';

const BASE = environment.baseUrl;

function findNode(tree: CategoryNode[], slug: string): CategoryNode | null {
  for (const node of tree) {
    if (node.category.slug === slug) return node;
    const found = findNode(node.children, slug);
    if (found) return found;
  }
  return null;
}

function buildKeywords(
  categoryName: string,
  subCategoryName?: string,
  extraKeywords: string = ''
): string {
  const parts = [
    subCategoryName ?? categoryName,
    categoryName,
    'flores',
    'arreglos florales',
    'floristería Akasia',
    'Pereira',
    'Dosquebradas',
    'entrega a domicilio',
  ];
  if (extraKeywords) parts.unshift(extraKeywords);
  return [...new Set(parts)].join(', ');
}

export const categorySeoResolver: ResolveFn<void> = (route) => {

  const categoryService = inject(CategoryService);
  const metaService = inject(MetaService);

  const categorySlug = route.parent?.paramMap.get('categoryRoute') ?? route.paramMap.get('categoryRoute') ?? '';
  return categoryService.getCategories().pipe(
    take(1),
    map(tree => {
      const node = findNode(tree, categorySlug);
      const cat = node?.category;

      const name = cat?.name ?? categorySlug;
      const description = cat?.description?.trim() || null;

      const meta: PageMetadata = {
        title: `${name}`,
        description:
          description ??
          `Explora nuestra colección de ${name}. Arreglos florales con entrega a domicilio en Pereira y Dosquebradas.`,
        keywords: buildKeywords(name),
        url: `${BASE}/categorias/${categorySlug}`,
        type: 'website',
      };

      metaService.updateMetaTags(meta);
    })
  );


};

export const subCategorySeoResolver: ResolveFn<void> = (route) => {

  const categoryService = inject(CategoryService);
  const metaService = inject(MetaService);

  const subSlug = route.paramMap.get('subCategoryRoute') ?? '';
  const catSlug = route.parent?.paramMap.get('categoryRoute') ?? '';

  return categoryService.getCategories().pipe(
    take(1),
    map(tree => {
      const parentNode = findNode(tree, catSlug);
      const subNode = parentNode?.children.find(c => c.category.slug === subSlug) ?? null;

      const catName = parentNode?.category.name ?? catSlug;
      const subName = subNode?.category.name ?? subSlug;
      const subDesc = subNode?.category.description ?? null;

      const meta: PageMetadata = {
        title: `${subName} — ${catName}`,
        description:
          subDesc ??
          `Descubre nuestra selección de ${subName} dentro de ${catName}. Arreglos florales con entrega a domicilio en Pereira y Dosquebradas.`,
        keywords: buildKeywords(catName, subName),
        url: `${BASE}/categorias/${catSlug}/${subSlug}`,
        type: 'website',
      };

      metaService.updateMetaTags(meta);
    })
  );
};


