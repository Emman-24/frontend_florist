import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express, {NextFunction, Request, Response} from 'express';
import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {rateLimit} from 'express-rate-limit';
import helmet from 'helmet';

const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');

const isProduction = process.env['NODE_ENV'] === 'production';
const app = express();
const angularApp = new AngularNodeAppEngine();


app.set('trust proxy', 1);
app.disable('x-powered-by');


app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        'default-src': ["'self'"],
        'script-src': [
          "'self'",
          "'unsafe-inline'",
        ],
        'style-src': [
          "'self'",
          "'unsafe-inline'",
          'https://fonts.googleapis.com',
        ],
        'font-src': [
          "'self'",
          'https://fonts.gstatic.com',
        ],

        'img-src': [
          "'self'",
          'data:',
          'https://res.cloudinary.com',
          'https://www.floristeriaakasia.com.co',
        ],
        'connect-src': isProduction
          ? [
            "'self'",
            'https://www.backendflorist-production.up.railway.app',
          ] : [
            "'self'",
            'http://localhost:8080',
            'https://www.backendflorist-production.up.railway.app',
          ],

        'frame-ancestors': ["'none'"],
        'form-action': ["'self'"],
        'base-uri': ["'self'"],
        'object-src': ["'none'"],
        'upgrade-insecure-requests': isProduction ? [] : null,
      },
    },

    strictTransportSecurity: isProduction ? {
      maxAge: 31_536_000,
      includeSubDomains: true, preload: true
    } : false,

    xFrameOptions: {action: 'deny'},
    xContentTypeOptions: true,
    referrerPolicy: {policy: 'strict-origin-when-cross-origin'},
    permittedCrossDomainPolicies: {permittedPolicies: 'none'},
    crossOriginEmbedderPolicy: false,
    crossOriginOpenerPolicy: {policy: 'unsafe-none'},
    crossOriginResourcePolicy: {policy: 'same-site'},
    dnsPrefetchControl: {allow: false},
  })
);

app.use((_req: Request, res: Response, next: NextFunction) => {
  res.setHeader(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), payment=()'
  );
  next();
});

const globalLimiter = rateLimit({
  windowMs: 60 * 1_000,
  max: 200,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {error: 'Too many requests. Please try again later.'},
  skip: (req) => req.path === '/health',
});

app.use(globalLimiter);

app.use(express.json({limit: '50kb'}));
app.use(express.urlencoded({extended: false, limit: '50kb'}));


app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({status: 'ok', timestamp: new Date().toISOString()});
});

app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
    dotfiles: 'deny',
    setHeaders(res, filePath) {
      if (filePath.endsWith('ngsw.json') || filePath.endsWith('ngsw-worker.js')) {
        res.setHeader('Cache-Control', 'no-cache, no-store');
      }
    },
  }),
);


app.use('/**', (req: Request, res: Response, next: NextFunction) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next()
    )
    .catch((err) => {
      if (isProduction) {
        console.error('[SSR error]', err);
        res.status(500).send('An internal error occurred.');
      } else {
        next(err);
      }
    });
});

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (isProduction) {
    console.error('[Unhandled error]', err);
    res.status(500).send('An internal error occurred.');
  } else {
    console.error(err);
    res.status(500).send(`<pre>${err.stack}</pre>`);
  }
});

if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 4000;
  const server = app.listen(port, () => {
    console.log(
      `Node Express server listening on http://localhost:${port} [${isProduction ? 'production' : 'development'}]`
    );
  });

  server.headersTimeout = 30_000;
  server.requestTimeout = 30_000;
  server.keepAliveTimeout = 65_000;
}

export const reqHandler = createNodeRequestHandler(app);
