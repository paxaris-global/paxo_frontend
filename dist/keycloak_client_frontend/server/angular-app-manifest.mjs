
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
    "route": "/dashboard/product/generate-product"
  },
  {
    "renderMode": 2,
    "route": "/dashboard/settings"
  },
  {
    "renderMode": 2,
    "redirectTo": "/",
    "route": "/**"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 2219, hash: 'b42c6d51375f311b07ac1213d6c7085b33f60009cff6c7510df227d146c4e430', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1019, hash: 'eea3a9a1f6761307ed9d00dde13e01e451cf01db32476aaf72a06e9b76c26933', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'dashboard/product/roleUrl/index.html': {size: 0, hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', text: () => import('./assets-chunks/dashboard_product_roleUrl_index_html.mjs').then(m => m.default)},
    'dashboard/product/roles/index.html': {size: 0, hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', text: () => import('./assets-chunks/dashboard_product_roles_index_html.mjs').then(m => m.default)},
    'dashboard/product/users/index.html': {size: 0, hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', text: () => import('./assets-chunks/dashboard_product_users_index_html.mjs').then(m => m.default)},
    'dashboard/product/generate-product/index.html': {size: 0, hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', text: () => import('./assets-chunks/dashboard_product_generate-product_index_html.mjs').then(m => m.default)},
    'dashboard/product/products/index.html': {size: 0, hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', text: () => import('./assets-chunks/dashboard_product_products_index_html.mjs').then(m => m.default)},
    'signup/index.html': {size: 15204, hash: 'c6679df3a8e0fb1ab37bafec21381fca97f1a1d27208caaecb06676c8795a5f6', text: () => import('./assets-chunks/signup_index_html.mjs').then(m => m.default)},
    'dashboard/settings/index.html': {size: 0, hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', text: () => import('./assets-chunks/dashboard_settings_index_html.mjs').then(m => m.default)},
    'dashboard/product/assign-roles/index.html': {size: 0, hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', text: () => import('./assets-chunks/dashboard_product_assign-roles_index_html.mjs').then(m => m.default)},
    'login/index.html': {size: 17433, hash: 'a283a94513b1323a92e1aff4a0bf5509d9bda3a15640f70b409cfff8b2164f06', text: () => import('./assets-chunks/login_index_html.mjs').then(m => m.default)},
    'index.html': {size: 28126, hash: 'a71e2475cc53d4f1e11e7abc69910b5501d5468c311c53c92bc71345e8bc42f8', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)},
    'styles-5GCHT6XK.css': {size: 7029, hash: '57xOQ+476YU', text: () => import('./assets-chunks/styles-5GCHT6XK_css.mjs').then(m => m.default)}
  },
};
