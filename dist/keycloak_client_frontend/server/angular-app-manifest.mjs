
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
    "redirectTo": "/dashboard/client/products",
    "route": "/dashboard"
  },
  {
    "renderMode": 2,
    "redirectTo": "/dashboard/client/products",
    "route": "/dashboard/client"
  },
  {
    "renderMode": 2,
    "route": "/dashboard/client/products"
  },
  {
    "renderMode": 2,
    "route": "/dashboard/client/users"
  },
  {
    "renderMode": 2,
    "route": "/dashboard/client/roles"
  },
  {
    "renderMode": 2,
    "route": "/dashboard/client/roleUrl"
  },
  {
    "renderMode": 2,
    "route": "/dashboard/client/assign-roles"
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
    'index.csr.html': {size: 2219, hash: '43421b50cb7c022a7b73df39cb59fa3407dd6dc6adf101d06e4f9c313d07df31', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1019, hash: '30a9a7f0959efab20b3d4dbf02169b34cff375152ddb95c6bcd5591c30594d5c', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'dashboard/client/roles/index.html': {size: 0, hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', text: () => import('./assets-chunks/dashboard_client_roles_index_html.mjs').then(m => m.default)},
    'dashboard/settings/index.html': {size: 0, hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', text: () => import('./assets-chunks/dashboard_settings_index_html.mjs').then(m => m.default)},
    'signup/index.html': {size: 12104, hash: 'd627bf7eab48a804d714930f55d95c541ab94d992d2f897a43aca58f1e0a688f', text: () => import('./assets-chunks/signup_index_html.mjs').then(m => m.default)},
    'dashboard/client/users/index.html': {size: 0, hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', text: () => import('./assets-chunks/dashboard_client_users_index_html.mjs').then(m => m.default)},
    'dashboard/client/assign-roles/index.html': {size: 0, hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', text: () => import('./assets-chunks/dashboard_client_assign-roles_index_html.mjs').then(m => m.default)},
    'dashboard/client/roleUrl/index.html': {size: 0, hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', text: () => import('./assets-chunks/dashboard_client_roleUrl_index_html.mjs').then(m => m.default)},
    'dashboard/client/products/index.html': {size: 0, hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', text: () => import('./assets-chunks/dashboard_client_products_index_html.mjs').then(m => m.default)},
    'login/index.html': {size: 12050, hash: 'd8f521b689361db9fef122cd345b31b3a21ea04cba3745ca8d670a76843e6343', text: () => import('./assets-chunks/login_index_html.mjs').then(m => m.default)},
    'styles-5GCHT6XK.css': {size: 7029, hash: '57xOQ+476YU', text: () => import('./assets-chunks/styles-5GCHT6XK_css.mjs').then(m => m.default)}
  },
};
