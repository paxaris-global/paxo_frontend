/**
 * Single role item for create roles API payload.
 * POST /identity/{realm}/clients/{clientId}/roles
 */
export interface RoleCreationItem {
  name: string;
  description: string;
  url: string;
  uri: string;
}

/**
 * Payload for create roles endpoint (array of RoleCreationItem).
 */
export type CreateRolesPayload = RoleCreationItem[];
