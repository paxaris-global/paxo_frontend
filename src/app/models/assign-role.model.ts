/**
 * Single role reference for assign-role API.
 * POST /identity/{realm}/users/{username}/clients/{clientName}/roles
 */
export interface AssignRoleItem {
  name: string;
}

/**
 * Payload for assign role to user (array of role names).
 */
export type AssignRolePayload = AssignRoleItem[];
