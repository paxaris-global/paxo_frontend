import { RenderMode, ServerRoute } from '@angular/ssr';

/**
 * Only prerender public marketing pages. Dashboard and auth routes must render on
 * the client so reload keeps the SPA, localStorage token, and API proxy working.
 */
export const serverRoutes: ServerRoute[] = [
  { path: '', renderMode: RenderMode.Prerender },
  { path: 'products', renderMode: RenderMode.Prerender },
  { path: 'login', renderMode: RenderMode.Client },
  { path: 'signup', renderMode: RenderMode.Client },
  { path: 'dashboard/**', renderMode: RenderMode.Client },
  { path: '**', renderMode: RenderMode.Client },
];
