import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express, { type Request, type Response } from 'express';
import type { IncomingHttpHeaders } from 'node:http';
import * as http from 'node:http';
import * as https from 'node:https';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();

/** Same targets as proxy.conf.js — ng serve SSR uses this Express app; CLI proxy config does not apply here. */
const API_GATEWAY_URL =
  process.env['API_GATEWAY_URL'] ??
  `http://127.0.0.1:${process.env['PAXO_GATEWAY_LOCAL_PORT'] ?? '8085'}`;
const PYTHON_FOUNDRY_FRONTEND_URL =
  process.env['PYTHON_FOUNDRY_FRONTEND_URL'] ??
  `http://127.0.0.1:${process.env['PAXO_PYTHON_FRONTEND_LOCAL_PORT'] ?? '4201'}`;

function isGatewayApiPath(urlPath: string): boolean {
  const pathOnly = urlPath.split('?')[0] ?? '';
  return (
    pathOnly === '/identity' ||
    pathOnly.startsWith('/identity/') ||
    pathOnly === '/gateway' ||
    pathOnly.startsWith('/gateway/') ||
    pathOnly === '/project' ||
    pathOnly.startsWith('/project/') ||
    pathOnly === '/api/v1/project' ||
    pathOnly.startsWith('/api/v1/project/')
  );
}

function isPythonFoundryApiPath(urlPath: string): boolean {
  const pathOnly = urlPath.split('?')[0] ?? '';
  return pathOnly === '/python-foundry-api' || pathOnly.startsWith('/python-foundry-api/');
}

function stripHopByHopHeaders(headers: IncomingHttpHeaders): Record<string, string | string[] | undefined> {
  const out: Record<string, string | string[] | undefined> = { ...headers };
  delete out['connection'];
  delete out['keep-alive'];
  delete out['transfer-encoding'];
  delete out['proxy-connection'];
  return out;
}

function rewritePythonFoundryUrl(rawUrl: string): string {
  const [pathPart, query] = rawUrl.split('?');
  const rewrittenPath = (pathPart || '/').replace(/^\/python-foundry-api(?=\/|$)/, '/api');
  return query == null ? rewrittenPath : `${rewrittenPath}?${query}`;
}

function proxyRequest(inReq: Request, outRes: Response, targetBaseUrl: string, outPath: string): void {
  const base = new URL(targetBaseUrl);
  const lib = base.protocol === 'https:' ? https : http;
  const port =
    base.port !== ''
      ? Number(base.port)
      : base.protocol === 'https:'
        ? 443
        : 80;
  const fwdHeaders = stripHopByHopHeaders(inReq.headers);
  fwdHeaders['host'] = base.host;

  const proxyReq = lib.request(
    {
      hostname: base.hostname,
      port,
      path: outPath,
      method: inReq.method,
      headers: fwdHeaders as http.OutgoingHttpHeaders,
    },
    (proxyRes) => {
      outRes.writeHead(proxyRes.statusCode ?? 502, proxyRes.headers as http.OutgoingHttpHeaders);
      proxyRes.pipe(outRes);
    },
  );

  proxyReq.on('error', (err) => {
    if (!outRes.headersSent) {
      outRes.statusCode = 502;
      outRes.setHeader('Content-Type', 'application/json');
      outRes.end(JSON.stringify({ message: `Cannot reach upstream at ${targetBaseUrl}: ${err.message}` }));
    }
  });

  inReq.pipe(proxyReq);
}

app.use((req, res, next) => {
  const pathOnly = (req.originalUrl ?? req.url ?? '').split('?')[0] ?? '';
  if (!isGatewayApiPath(pathOnly)) {
    if (!isPythonFoundryApiPath(pathOnly)) {
      return next();
    }
    const rawUrl = req.originalUrl ?? req.url ?? '/';
    proxyRequest(req, res, PYTHON_FOUNDRY_FRONTEND_URL, rewritePythonFoundryUrl(rawUrl));
    return;
  }
  proxyRequest(req, res, API_GATEWAY_URL, req.originalUrl ?? req.url ?? '/');
});
let angularApp: AngularNodeAppEngine | null = null;

try {
  angularApp = new AngularNodeAppEngine();
} catch (error) {
  // Angular 20 can throw at startup when engine manifest.allowedHosts iss undefined.
  // Keep the server operational by falling back to CSR until the upstream bug is fixed.
  if (process.env['SSR_FALLBACK_LOG'] === 'true') {
    const message = error instanceof Error ? error.message : 'Unknown SSR startup error';
    console.warn(`SSR engine disabled, using CSR fallback (${message}).`);
  }
}

function resolveFallbackIndexFile(): string | null {
  const candidates = [
    join(browserDistFolder, 'index.csr.html'),
    join(browserDistFolder, 'index.html'),
    join(process.cwd(), 'src', 'index.html'),
  ];

  for (const candidate of candidates) {
    if (existsSync(candidate)) {
      return candidate;
    }
  }

  return null;
}

function renderDevFallbackHtml(indexPath: string): string {
  const baseHtml = readFileSync(indexPath, 'utf-8');
  const bootstrapTags = [
    '<link rel="stylesheet" href="/styles.css">',
    '<script type="module" src="/polyfills.js"></script>',
    '<script type="module" src="/main.js"></script>',
  ].join('\n');

  if (baseHtml.includes('</body>')) {
    return baseHtml.replace('</body>', `${bootstrapTags}\n</body>`);
  }

  return `${baseHtml}\n${bootstrapTags}`;
}

/**
 * Example Express Rest API endpoints can be defined here.
 * Uncomment and define endpoints as necessary.
 *
 * Example:
 * ```ts
 * app.get('/api/{*splat}', (req, res) => {
 *   // Handle API request
 * });
 * ```
 */

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  if (!angularApp) {
    const fallbackIndex = resolveFallbackIndexFile();
    if (fallbackIndex) {
      if (fallbackIndex.endsWith(join('src', 'index.html'))) {
        try {
          const html = renderDevFallbackHtml(fallbackIndex);
          return res.status(200).type('html').send(html);
        } catch (error) {
          return next(error);
        }
      }

      return res.sendFile(fallbackIndex, (error) => {
        if (error) {
          next(error);
        }
      });
    }

    return next();
  }

  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

/**
 * Start the server if this module is the main entry point.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
