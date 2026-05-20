
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "route": "/"
  },
  {
    "renderMode": 2,
    "route": "/products"
  },
  {
    "renderMode": 1,
    "route": "/login"
  },
  {
    "renderMode": 1,
    "route": "/signup"
  },
  {
    "renderMode": 1,
    "redirectTo": "/dashboard/product/products",
    "route": "/dashboard"
  },
  {
    "renderMode": 1,
    "redirectTo": "/dashboard/product/products",
    "route": "/dashboard/product"
  },
  {
    "renderMode": 1,
    "route": "/dashboard/product/products"
  },
  {
    "renderMode": 1,
    "route": "/dashboard/product/users"
  },
  {
    "renderMode": 1,
    "route": "/dashboard/product/roles"
  },
  {
    "renderMode": 1,
    "route": "/dashboard/product/roleUrl"
  },
  {
    "renderMode": 1,
    "route": "/dashboard/product/assign-roles"
  },
  {
    "renderMode": 1,
    "route": "/dashboard/product/generate-product"
  },
  {
    "renderMode": 1,
    "route": "/dashboard/settings"
  },
  {
    "renderMode": 1,
    "redirectTo": "/",
    "route": "/**"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 2379, hash: '1f3460744d9cf349b714c3069fdd65e19928a87955a56db5dbb3329315e42233', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1180, hash: 'b928f68f276ce5bdb3a6b5bd5679b728bdb6b15153e7c3f49816b79c4325b59c', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'products/index.html': {size: 12024, hash: '65150343be6c9ba647513d4aff0f4f01f045173e4e0a10596833688ecfc38b50', text: () => import('./assets-chunks/products_index_html.mjs').then(m => m.default)},
    'index.html': {size: 31743, hash: '39041a0b6d649c2b362054d2edd400517b5075467ebf7aae468a06b84c9e5d9b', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)},
    'styles-5GCHT6XK.css': {size: 7029, hash: '57xOQ+476YU', text: () => import('./assets-chunks/styles-5GCHT6XK_css.mjs').then(m => m.default)}
  },
};
