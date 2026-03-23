import { ResolveFn } from '@angular/router';
import {inject} from '@angular/core';
import {MetaService, PageMetadata} from '../../services/meta/meta.service';

export const seoResolver: ResolveFn<void> = (route) => {

  const metaService = inject(MetaService);

  const seoConfig = route.data['seo'];

  if (seoConfig) {
    let metadata:PageMetadata;

    if (typeof seoConfig === 'function') {
      metadata = seoConfig(route);
    } else {
      metadata = seoConfig;
    }

    metaService.updateMetaTags(metadata);
  }

  return
};
