
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "redirectTo": "/login",
    "route": "/"
  },
  {
    "renderMode": 2,
    "route": "/login"
  },
  {
    "renderMode": 2,
    "route": "/signup"
  },
  {
    "renderMode": 2,
    "redirectTo": "/dashboard/product/products",
    "route": "/dashboard"
  },
  {
    "renderMode": 2,
    "redirectTo": "/dashboard/product/products",
    "route": "/dashboard/product"
  },
  {
    "renderMode": 2,
    "route": "/dashboard/product/products"
  },
  {
    "renderMode": 2,
    "route": "/dashboard/product/users"
  },
  {
    "renderMode": 2,
    "route": "/dashboard/product/roles"
  },
  {
    "renderMode": 2,
    "route": "/dashboard/product/roleUrl"
  },
  {
    "renderMode": 2,
    "route": "/dashboard/product/assign-roles"
  },
  {
    "renderMode": 2,
    "route": "/dashboard/settings"
  },
  {
    "renderMode": 2,
    "redirectTo": "/login",
    "route": "/**"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 2219, hash: '939e5b963c0397956b6cf39b0150a39a12676eaca2d27b9483f63fb376ee2f75', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1019, hash: '7901aa99e65bcc7ada4c8bf52b2a888ded802b7076769a76111c272876c80e47', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'signup/index.html': {size: 12104, hash: '9c48656b882c3a0365f6d4df007cc285c0377cbac20b7be38fdb0eaa1a1a4c3f', text: () => import('./assets-chunks/signup_index_html.mjs').then(m => m.default)},
    'dashboard/settings/index.html': {size: 0, hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', text: () => import('./assets-chunks/dashboard_settings_index_html.mjs').then(m => m.default)},
    'dashboard/product/users/index.html': {size: 0, hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', text: () => import('./assets-chunks/dashboard_product_users_index_html.mjs').then(m => m.default)},
    'dashboard/product/roles/index.html': {size: 0, hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', text: () => import('./assets-chunks/dashboard_product_roles_index_html.mjs').then(m => m.default)},
    'dashboard/product/assign-roles/index.html': {size: 0, hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', text: () => import('./assets-chunks/dashboard_product_assign-roles_index_html.mjs').then(m => m.default)},
    'dashboard/product/products/index.html': {size: 0, hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', text: () => import('./assets-chunks/dashboard_product_products_index_html.mjs').then(m => m.default)},
    'dashboard/product/roleUrl/index.html': {size: 0, hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', text: () => import('./assets-chunks/dashboard_product_roleUrl_index_html.mjs').then(m => m.default)},
    'login/index.html': {size: 12050, hash: '9b2084cb2836fe647337c30ba0d5ac5a5e8b9fe1cb4f541f917992cee58f7dc6', text: () => import('./assets-chunks/login_index_html.mjs').then(m => m.default)},
    'styles-5GCHT6XK.css': {size: 7029, hash: '57xOQ+476YU', text: () => import('./assets-chunks/styles-5GCHT6XK_css.mjs').then(m => m.default)}
  },
};
