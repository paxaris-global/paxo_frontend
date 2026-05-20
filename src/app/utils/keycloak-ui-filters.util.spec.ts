import {
  filterProductRowsForUi,
  filterRoleRowsForUi,
  isUserVisibleProductClient,
} from './keycloak-ui-filters.util';

describe('keycloak-ui-filters', () => {
  it('hides built-in Keycloak clients from product dropdowns', () => {
    const rows = [
      { clientId: 'account' },
      { clientId: 'broker' },
      { clientId: 'realm-management' },
      { clientId: 'my-shop' },
      { clientId: 'paxarisGlobal-admin-product' },
    ];
    const filtered = filterProductRowsForUi(rows);
    expect(filtered.map((r) => (r as { clientId: string }).clientId)).toEqual([
      'my-shop',
      'paxarisGlobal-admin-product',
    ]);
  });

  it('hides account default roles and signup bootstrap admin roles', () => {
    const roles = [
      { name: 'view-profile' },
      { name: 'manage-account' },
      { name: 'manage-realm' },
      { name: 'admin-management' },
      { name: 'cashier' },
      { name: 'store-manager' },
    ];
    expect(filterRoleRowsForUi(roles).map((r) => (r as { name: string }).name)).toEqual([
      'cashier',
      'store-manager',
    ]);
  });

  it('treats empty client id as not visible', () => {
    expect(isUserVisibleProductClient('')).toBe(false);
    expect(isUserVisibleProductClient('  ')).toBe(false);
  });
});
