
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
    'index.csr.html': {size: 2219, hash: 'a9be79e3ecfe9f7f5708a84b7a8fe0e25f7c6797e939a24cfeafed1ded922752', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1019, hash: 'b166b42aae8a72fb6494ec0de5e20e0653382db6ecacfbc63e1f852b956964d7', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'dashboard/product/roles/index.html': {size: 0, hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', text: () => import('./assets-chunks/dashboard_product_roles_index_html.mjs').then(m => m.default)},
    'dashboard/settings/index.html': {size: 0, hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', text: () => import('./assets-chunks/dashboard_settings_index_html.mjs').then(m => m.default)},
    'dashboard/product/users/index.html': {size: 0, hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', text: () => import('./assets-chunks/dashboard_product_users_index_html.mjs').then(m => m.default)},
    'login/index.html': {size: 12050, hash: '7877f2e8fe4ab710d71cc036fb97a8ca36abba1dff045e45e67b62296c19878f', text: () => import('./assets-chunks/login_index_html.mjs').then(m => m.default)},
    'dashboard/product/assign-roles/index.html': {size: 0, hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', text: () => import('./assets-chunks/dashboard_product_assign-roles_index_html.mjs').then(m => m.default)},
    'dashboard/product/roleUrl/index.html': {size: 0, hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', text: () => import('./assets-chunks/dashboard_product_roleUrl_index_html.mjs').then(m => m.default)},
    'signup/index.html': {size: 12104, hash: '97023a6eb9e47a7ef990de09be58c7b5181df5bda9215bf53b5d81cbea5cb881', text: () => import('./assets-chunks/signup_index_html.mjs').then(m => m.default)},
    'dashboard/product/products/index.html': {size: 0, hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', text: () => import('./assets-chunks/dashboard_product_products_index_html.mjs').then(m => m.default)},
    'styles-5GCHT6XK.css': {size: 7029, hash: '57xOQ+476YU', text: () => import('./assets-chunks/styles-5GCHT6XK_css.mjs').then(m => m.default)}
  },
};
