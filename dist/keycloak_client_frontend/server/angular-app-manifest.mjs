
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
    'index.csr.html': {size: 2379, hash: '362f3492e6294800bad395d5904622c8f385dc83a93ac6c5d8586ec73e7f916f', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1180, hash: '292bf7efd0353446c00dc5d7b8ffaf781787bcbdb8e4855cfb2ab4faea3b27c4', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'index.html': {size: 31547, hash: '9a704b75be08db6b5ead7768bc05420b131de425af3e227049cd8e605aeccac3', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)},
    'products/index.html': {size: 12024, hash: 'b499c928646ee8c10e4eb95f63b04abdaa7621d44ce272f62e461e90243ef24f', text: () => import('./assets-chunks/products_index_html.mjs').then(m => m.default)},
    'styles-5GCHT6XK.css': {size: 7029, hash: '57xOQ+476YU', text: () => import('./assets-chunks/styles-5GCHT6XK_css.mjs').then(m => m.default)}
  },
};
