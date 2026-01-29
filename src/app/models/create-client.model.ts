/**
 * Create client request body.
 * POST /identity/{realm}/clients
 */
export interface CreateClientRequest {
  clientId: string;
  publicClient: boolean;
  urls: string[];
}
