import {ApplicationConfig, provideZoneChangeDetection} from '@angular/core';
import {provideRouter, withInMemoryScrolling} from '@angular/router';

import {routes} from './app.routes';
import {provideClientHydration, withEventReplay} from '@angular/platform-browser';
import {provideHttpClient, withFetch, withInterceptors} from '@angular/common/http';
import {httpErrorInterceptor} from './interceptor/http-error.interceptor';

export const appConfig: ApplicationConfig =
  {
    providers: [
      provideZoneChangeDetection({eventCoalescing: true}),
      provideRouter(
        routes,
        withInMemoryScrolling({scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled'})
      ),
      provideClientHydration(withEventReplay()),
      provideHttpClient(withFetch(), withInterceptors([httpErrorInterceptor]))
    ]
  };
